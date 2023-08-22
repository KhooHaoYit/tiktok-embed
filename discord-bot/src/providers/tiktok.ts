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
    if (!interaction.customId.startsWith('tiktok.'))
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
  return await extractLinks(msg.content, async postId => {
    const result = await getTiktokPost(postId)
      || await fetchTiktokPost(postId);
    if (!result)
      throw new Error(`Unable to fetch tiktok post`);
    await msg.channel.send({
      content: `
Requested by ${msg.author}
${env.FRONTEND_URL}/tiktok/${postId}/embed
${env.FRONTEND_URL}/tiktok/${postId}/0
`,
      allowedMentions: { users: [] },
      components: buildComponent(result.attachmentIds.length),
    });
  });

  async function extractLinks(text: string, handle: (postId: string) => Promise<void>) {
    return await Promise.allSettled(
      text.match(/\bhttps?:\/\/\S+/gi)
        ?.map(async urlText => {
          const url = new URL(urlText);
          let postId = '';
          if (/^(?:www\.|)tiktok\.com$/.test(url.hostname))
            postId = url.pathname.split('/').at(-1)!;
          else if (url.hostname.endsWith('.tiktok.com'))
            postId = await request(urlText, { method: 'HEAD' })
              .then(({ headers }) => {
                const url = new URL(<string>headers.location);
                return url.pathname.split('/').at(-1)!;
              });
          if (!postId)
            return 0;
          if (!/^\d+$/.test(postId))
            throw new Error(`postId isn't all numbers`);
          await handle(postId);
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
          .setCustomId(`tiktok.${pageCount}`)
          .setLabel(`Load More`)
          .setStyle(ButtonStyle.Primary)),
  ];
}

async function getTiktokPost(post: string) {
  return await request(
    env.TIKTOK_API_URL + `/posts/${post}`,
    {
      query: {
        includeAuthor: 1,
        includeAttachment: 1,
      },
      headers: {
        // Authorization: env.,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

async function fetchTiktokPost(post: string) {
  return await request(
    env.TIKTOK_API_URL + `/posts/${post}`,
    {
      method: 'POST',
      query: {
        includeAuthor: 1,
        includeAttachment: 1,
      },
      headers: {
        // Authorization: env.,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

type Data = {
  "id": string
  "description": string
  "likes": number
  "shares": number
  "comments": number
  "attachmentIds": string[]
  "authorId": string
  "i_createdAt": string
  "i_updatedAt": string
  "author": {
    "id": string
    "username": string
    "handle": string
    "avatarUrl": string
    "i_createdAt": string
    "i_updatedAt": string
  },
  "attachments": Record<
    string,
    {
      "id": string
      "width": number
      "height": number
      "imageUrl": string
      "videoUrl": string
      "i_createdAt": string
      "i_updatedAt": string
    }
  >
};
