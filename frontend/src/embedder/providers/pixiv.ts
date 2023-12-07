import { request } from "undici";
import { env } from "../../env";
import { DiscordEmbedder } from ".";



export const pixivEmbedEmbedder = async function (
  {
    artworkId,
    host,
  }: {
    artworkId: string
    host: string
  }
) {
  const result = await getArtwork(artworkId)
    || await fetchArtwork(artworkId);
  if (!result)
    throw new Error(`Unable to fetch artworkId: ${artworkId}`);
  const redirectUrl = `https://www.pixiv.net/artworks/${artworkId}`;
  return {
    redirectUrl,
    embed: {
      color: '#009cff',
      thumbnailUrl: result.author.avatarUrl,
      providerName: 'Pixiv Auto Embed',
      authorName: (
        [
          ['💬', +result.comments],
          ['❤️', +result.likes],
          ['🔖', +result.bookmarks],
          ['👀', +result.views],
        ] satisfies [string, number][]
      ).filter(item => item[1] && !Number.isNaN(item[1]) && item[1] > 0)
        .map(([emoji, amount]) => `${amount.toLocaleString('en')} ${emoji}`)
        .join('    '),
      authorUrl: redirectUrl,
      title: `${result.author.username} (@${result.author.handle})`,
      description: result.description,
      oembedUrl: `https://${host}/api/oembed?type=pixiv&artworkId=${artworkId}`,
    },
  };
} satisfies DiscordEmbedder;

export const pixivAttachmentEmbedder = async function (
  {
    artworkId,
    index,
  }: {
    artworkId: string
    index: number
  }
) {
  const result = await getArtwork(artworkId)
    || await fetchArtwork(artworkId);
  if (!result)
    throw new Error(`Unable to fetch artworkId: ${artworkId}`);
  const redirectUrl = `https://www.pixiv.net/artworks/${artworkId}`;
  const attachment = result.attachments[result.attachmentIds[index]];
  return {
    redirectUrl,
    image: {
      url: attachment.url,
      width: attachment.width,
      height: attachment.height,
    },
  };
} satisfies DiscordEmbedder;



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
