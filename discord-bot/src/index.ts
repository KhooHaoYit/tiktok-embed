import {
  Client,
  Partials,
} from "discord.js";
import { env } from "./env";
import { request } from 'undici';
import { IntentsBitField } from "discord.js";

import { activate } from "./commands";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
});

client.on('ready', () => {
  console.log('Logged in as', client.user!.tag);
});

client.on('messageCreate', async msg => {
  if (msg.author.bot)
    return;
  let postId: string = '';
  const shortLink = msg.content.match(/https?:\/\/vt\.tiktok\.com\/[a-zA-Z0-9]+/)?.at(0);
  if (shortLink)
    postId = await request(shortLink, { method: 'HEAD' })
      .then(({ headers }) => (<string>headers.location)
        .replace(/\?[^]*$/, '')
        .replace(/^[^]*\//, ''));
  const longLink = msg.content.match(/https?:\/\/(?:www\.|)tiktok\.com\/@[^\/]+\/video\/\d+/)?.at(0);
  if (longLink)
    postId = longLink.replace(/^[^]*\//, '')
  if (!postId)
    return;
  const { statusCode } = await request(`${env.INTERNAL_FRONTEND_URL}/v/${postId}/oembed`, { method: 'HEAD' });
  if (statusCode !== 200)
    return void await msg.react('🔥');
  await Promise.all([
    msg.suppressEmbeds()
      .catch(() => { }),
    msg.reply({
      content: `
${env.FRONTEND_URL}/v/${postId}/embed
${env.FRONTEND_URL}/v/${postId}/video
`.trim(),
      allowedMentions: { repliedUser: false },
      failIfNotExists: false,
    }),
  ]);
});

client.on('error', console.error);

(async () => {
  await activate(client);
  await client.login(env.DISCORD_TOKEN);
})();
