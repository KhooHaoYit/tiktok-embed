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
    if (!interaction.customId.startsWith('pixiv.'))
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
      components: currentIndex + 5 < +pageCount - 1
        ? buildComponent(+pageCount)
        : [],
    });
  });
}

export async function onMessage(msg: Message) {
  return await extractLinks(msg.content, async shortcode => {
    const result = await getArtwork(shortcode)
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
      || await fetchArtwork(shortcode);
    if (!result)
      throw new Error(`Unable to fetch pixiv post`);
    await msg.channel.send({
      content: `
Requested by ${msg.author}
${env.FRONTEND_URL}/pixiv/${shortcode}/embed
${env.FRONTEND_URL}/pixiv/${shortcode}/0
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
          let artworkId = '';
          if (/^(?:www\.|)pixiv\.net$/.test(url.hostname)) {
            const found = url.pathname.match(/(?<=^(?:\/en)?\/artworks\/)\d+/);
            if (found)
              artworkId = found[0];
          }
          if (!artworkId)
            return 0;
          await handle(artworkId);
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
          .setCustomId(`pixiv.${pageCount}`)
          .setLabel(`Load More`)
          .setStyle(ButtonStyle.Primary)),
  ];
}

async function getArtwork(artworkId: string) {
  return await request(
    `${env.PIXIV_API_URL}/artworks/${artworkId}`,
    {
      query: {
        includeAuthor: 1,
        includeAttachments: 1,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

async function fetchArtwork(artworkId: string) {
  return await request(
    `${env.PIXIV_API_URL}/artworks/${artworkId}/fetch`,
    {
      method: 'POST',
      query: {
        includeAuthor: 1,
        includeAttachments: 1,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

type Data = {
  id: string
  title: string
  description: string
  likes: number
  bookmarks: number
  views: number
  comments: number
  i_createdAt: string
  i_updatedAt: string
  authorId: string
  author: {
    id: string
    handle: string
    username: string
    avatarUrl: string
    i_createdAt: string
    i_updatedAt: string
  },
  attachmentIds: string[]
  attachments: Record<
    string,
    {
      id: string
      url: string
      width: number
      height: number
      i_createdAt: string
      i_updatedAt: string
    }
  >
};
