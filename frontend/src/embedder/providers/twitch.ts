import { request } from "undici";
import { env } from "../../env";
import { DiscordEmbedder } from ".";



export const twitchEmbedEmbedder = async function (
  {
    clipSlug,
    host,
  }: {
    clipSlug: string
    host: string
  }
) {
  const result = await getTwitchClip(clipSlug)
    || await fetchTwitchClip(clipSlug);
  if (!result)
    throw new Error(`Unable to fetch clipSlug: ${clipSlug}`);
  const redirectUrl = `https://clips.twitch.tv/${clipSlug}`;
  return {
    redirectUrl,
    embed: {
      color: '#6441a5',
      thumbnailUrl: result.streamerChannel.avatarUrl,
      providerName: 'Twitch Auto Embed',
      authorName: (
        [
          ['👀', +result.viewCount],
        ] satisfies [string, number][]
      ).filter(item => item[1] && !Number.isNaN(item[1]) && item[1] > 0)
        .map(([emoji, amount]) => `${amount.toLocaleString('en')} ${emoji}`)
        .join('    '),
      authorUrl: redirectUrl,
      title: result.title,
      description: `Clipped by ${result.clipperChannel.name}\n${result.streamerChannel.name} playing ${result.gameName}`,
      oembedUrl: `https://${host}/api/oembed?type=twitch&clipSlug=${clipSlug}`,
    },
  };
} satisfies DiscordEmbedder;

export const twitchAttachmentEmbedder = async function (
  {
    clipSlug,
  }: {
    clipSlug: string
  }
) {
  const result = await getTwitchClip(clipSlug)
    || await fetchTwitchClip(clipSlug);
  if (!result)
    throw new Error(`Unable to fetch clipSlug: ${clipSlug}`);
  const redirectUrl = `https://clips.twitch.tv/${clipSlug}`;
  return {
    redirectUrl,
    video: {
      width: result.width,
      height: result.height,
      videoUrl: result.videoUrl,
      imageUrl: result.thumbnailUrl,
    },
  };
} satisfies DiscordEmbedder;

export const twitchPlayerEmbedder = async function (
  {
    clipSlug,
  }: {
    clipSlug: string
  }
) {
  const result = await getTwitchClip(clipSlug)
    || await fetchTwitchClip(clipSlug);
  if (!result)
    throw new Error(`Unable to fetch clipSlug: ${clipSlug}`);
  const redirectUrl = `https://clips.twitch.tv/${clipSlug}`;
  return {
    redirectUrl,
    video: {
      width: result.width,
      height: result.height,
      videoUrl: `https://clips.twitch.tv/embed?clip=${clipSlug}&autoplay=true&parent=meta.tag`,
      imageUrl: result.thumbnailUrl,
    },
  };
} satisfies DiscordEmbedder;

async function getTwitchClip(clipSlug: string) {
  return await request(
    `${env.TWITCH_API_URL}/clips/${clipSlug}`,
    {
      query: {
        includeStreamerChannel: 1,
        includeClipperChannel: 1,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

async function fetchTwitchClip(clipSlug: string) {
  return await request(
    `${env.TWITCH_API_URL}/clips/${clipSlug}`,
    {
      method: 'POST',
      query: {
        includeStreamerChannel: 1,
        includeClipperChannel: 1,
      },
    },
  ).then(res => <Promise<null | Data>>res.body.json());
}

type Data = {
  "id": string
  "slug": string
  "title": string
  "videoUrl": string
  "thumbnailUrl": string
  "gameName": string
  "width": number
  "height": number
  "viewCount": number
  "streamerChannelId": string
  "clipperChannelId": string
  "i_updatedAt": string
  "i_createdAt": string
  "streamerChannel": {
    "id": string
    "handle": string
    "name": string
    "avatarUrl": string
    "i_updatedAt": string
    "i_createdAt": string
  },
  "clipperChannel": {
    "id": string
    "handle": string
    "name": string
    "avatarUrl": null,
    "i_updatedAt": string
    "i_createdAt": string
  }
}
