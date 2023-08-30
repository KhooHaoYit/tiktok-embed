import { request } from "undici";
import { DiscordEmbedder } from ".";
import { env } from "@/env";



export const instagramEmbedEmbedder = async function (shortcode: string) {
  const result = await getInstagramPost(shortcode)
    || await fetchInstagramPost(shortcode);
  if (!result)
    throw new Error('Unable to fetch instagram post');
  const redirectUrl = `https://www.instagram.com/p/${result.shortcode}`;
  return {
    redirectUrl,
    embed: {
      color: '#ce0071',
      thumbnailUrl: result.author.avatarUrl,
      providerName: 'Instagram Auto Embed',
      authorName: [
        ['💬', +result.comments],
        ['❤️', +result.likes],
      ].filter(item => item[1] && !Number.isNaN(item[1]))
        .map(([emoji, amount]) => `${amount.toLocaleString('en')} ${emoji}`)
        .join('    '),
      authorUrl: redirectUrl,
      title: `${result.author.username} (@${result.author.handle})`,
      description: result.description,
    },
  };
} satisfies DiscordEmbedder;

export const instagramAttachmentEmbedder = async function (shortcode: string, index: number) {
  const result = await getInstagramPost(shortcode)
    || await fetchInstagramPost(shortcode);
  if (!result)
    throw new Error('Unable to fetch instagram post');
  const redirectUrl = `https://www.instagram.com/p/${result.shortcode}`;
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
      },
    };
} satisfies DiscordEmbedder;



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
