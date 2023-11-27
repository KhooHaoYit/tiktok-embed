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
    if (interaction.customId !== 'twitch.player')
      return;
    if (interaction.message.partial)
      await interaction.message.fetch();
    const clipSlug = interaction.message.content.split('/').at(-2)!;
    await interaction.reply({
      ephemeral: true,
      content: `
[video](${env.FRONTEND_URL}/twitch/${clipSlug}/video)
`,
    });
  });
}

export async function onMessage(msg: Message) {
  return await extractLinks(msg.content, async clipSlug => {
    const result = await getTwitchClip(clipSlug)
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
      || await fetchTwitchClip(clipSlug);
    if (!result)
      throw new Error(`Unable to fetch twitch clip`);
    await msg.channel.send({
      content: `
Requested by ${msg.author}
[embed](${env.FRONTEND_URL}/twitch/${clipSlug}/embed) \
[player](${env.FRONTEND_URL}/twitch/${clipSlug}/player)
`,
      allowedMentions: { users: [] },
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`twitch.player`)
              .setLabel(`View In Mobile`)
              .setStyle(ButtonStyle.Primary)),
      ],
    });
  });

  async function extractLinks(text: string, handle: (clipSlug: string) => Promise<void>) {
    return await Promise.allSettled(
      text.match(/\bhttps?:\/\/\S+/gi)
        ?.map(async urlText => {
          const url = new URL(urlText);
          let clipSlug = '';

          if (/^clips\.twitch\.tv$/.test(url.hostname))
            clipSlug = url.pathname.split('/')[1];
          else if (
            /^(?:www\.)?twitch\.tv$/.test(url.hostname)
            && /^\/[^/]+\/clip\/[^/]+$/.test(url.pathname)
          )
            clipSlug = url.pathname.split('/').at(-1)!;

          if (!clipSlug)
            return 0;
          await handle(clipSlug);
          return 1;
        }) ?? [],
    );
  }
}

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
