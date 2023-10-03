import { request } from "undici";
import { env } from "../../env";
import { DiscordEmbedder } from ".";



export const tiktokEmbedEmbedder = async function (postId: string) {
  const result = await getTikTokPost(postId)
    || await fetchTikTokPost(postId);
  if (!result)
    throw new Error(`Unable to fetch postId: ${postId}`);
  const redirectUrl = `https://www.tiktok.com/@${result.author.handle}/video/${result.id}`;
  return {
    redirectUrl,
    embed: {
      color: '#fe2c55',
      thumbnailUrl: result.author.avatarUrl,
      providerName: 'TikTok Auto Embed',
      authorName: (
        [
          ['💬', +result.comments],
          ['🔁', +result.shares],
          ['❤️', +result.likes],
        ] satisfies [string, number][]
      ).filter(item => item[1] && !Number.isNaN(item[1]) && item[1] > 0)
        .map(([emoji, amount]) => `${amount.toLocaleString('en')} ${emoji}`)
        .join('    '),
      authorUrl: redirectUrl,
      title: `${result.author.username} (@${result.author.handle})`,
      description: result.description,
    },
  };
} satisfies DiscordEmbedder;

export const tiktokAttachmentEmbedder = async function (postId: string, index: number) {
  const result = await getTikTokPost(postId)
    || await fetchTikTokPost(postId);
  if (!result)
    throw new Error(`Unable to fetch postId: ${postId}`);
  const redirectUrl = `https://www.tiktok.com/@${result.author.handle}/video/${result.id}`;
  const attachment = result.attachments[result.attachmentIds[index]];
  return attachment.videoUrl
    ? {
      redirectUrl,
      video: {
        videoUrl: attachment.videoUrl,
        imageUrl: attachment.imageUrl,
        width: attachment.width,
        height: attachment.height,
      },
    }
    : {
      redirectUrl,
      image: {
        url: attachment.imageUrl,
        width: attachment.width,
        height: attachment.height,
      },
    };
} satisfies DiscordEmbedder;



async function getTikTokPost(postId: string) {
  return await request(
    `${env.TIKTOK_API_URL}/posts/${postId}`,
    {
      query: {
        includeAuthor: 1,
        includeAttachments: 1,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

async function fetchTikTokPost(postId: string) {
  return await request(
    `${env.TIKTOK_API_URL}/posts/${postId}/fetch`,
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
      "videoUrl": string | null
      "i_createdAt": string
      "i_updatedAt": string
    }
  >
};
