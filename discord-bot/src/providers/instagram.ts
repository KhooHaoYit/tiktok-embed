import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Events,
  Message,
} from "discord.js";
import { env } from "../env";
import { request } from "undici";

export async function activate(client: Client) {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton())
      return;
    if (!interaction.customId.startsWith('instagram.'))
      return;
    if (interaction.message.partial)
      await interaction.message.fetch();
    const [, pageCount] = interaction.customId.split('.');
    const url = interaction.message.content.split('\n').at(-1)!;
    const currentIndex = +url.match(/\d+$/)![0];
    const pageIndexes = Array(5)
      .fill(undefined)
      .map((_, index) => currentIndex + index + 1)
      .filter(pageIndex => pageIndex < +pageCount);
    await interaction.reply({
      ephemeral: true,
      content: pageIndexes
        .map(pageIndex => url.replace(/\d+$/, pageIndex + ''))
        .join('\n'),
      components: pageIndexes.length === 5
        ? buildComponent(+pageCount)
        : [],
    });
  });
}

export async function onMessage(msg: Message) {
  return await extractLinks(msg.content, async shortcode => {
    const result = await getInstagramPost(shortcode)
      .then(res => {
        if (!res || typeof env.CACHE_DURATION !== 'number')
          return res;
        if (
          Date.now() - new Date(res.i_updatedAt).getTime()
          < env.CACHE_DURATION
        )
          return res;
        return;
      })
      || await fetchInstagramPost(shortcode);
    if (!result)
      throw new Error(`Unable to fetch instagram post`);
    await msg.channel.send({
      content: `
Requested by ${msg.author}
${env.FRONTEND_URL}/instagram/${shortcode}/embed
${env.FRONTEND_URL}/instagram/${shortcode}/0
`,
      allowedMentions: { users: [] },
      components: buildComponent(result.attachmentIds.length),
    });
  });

  async function extractLinks(text: string, handle: (shortcode: string) => Promise<void>) {
    return await Promise.allSettled(
      text.match(/\bhttps?:\/\/\S+/gi)
        ?.map(async urlText => {
          const url = new URL(urlText);
          let shortcode = '';
          if (/^(?:www\.|)instagram\.com$/.test(url.hostname))
            shortcode = url.pathname
              .split('/')
              .filter(item => item)
              .at(-1)!;
          if (!shortcode)
            return 0;
          await handle(shortcode);
          return 1;
        }) ?? [],
    );
  }
}

function buildComponent(pageCount: number) {
  if (pageCount <= 1)
    return [];
  return [
    new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`instagram.${pageCount}`)
          .setLabel(`Load More`)
          .setStyle(ButtonStyle.Primary)),
  ];
}

async function getInstagramPost(shortcode: string) {
  return await request(
    env.INSTAGRAM_API_URL + `/shortcodes/${shortcode}`,
    {
      query: {
        includeAuthor: 1,
        includeAttachments: 1,
      },
      headers: {
        Authorization: env.INSTAGRAM_API_ACCESS_TOKEN,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

async function fetchInstagramPost(shortcode: string) {
  return await request(
    env.INSTAGRAM_API_URL + `/shortcodes/${shortcode}/fetch`,
    {
      method: 'POST',
      query: {
        includeAuthor: 1,
        includeAttachments: 1,
      },
      headers: {
        Authorization: env.INSTAGRAM_API_ACCESS_TOKEN,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

type Data = {
  "id": string
  "shortcode": string
  "description": string
  "comments": number
  "likes": number
  "attachmentIds": string[]
  "authorId": string
  "i_createdAt": string
  "i_updatedAt": string
  "author": {
    "id": string
    "handle": string
    "username": string
    "avatarUrl": string
    "i_createdAt": string
    "i_updatedAt": string
  }
  "attachments": Record<
    string,
    {
      "id": string,
      "width": number,
      "height": number,
      "imageUrl": string
      "videoUrl": string | null
      "i_createdAt": string
      "i_updatedAt": string
    }
  >
};
