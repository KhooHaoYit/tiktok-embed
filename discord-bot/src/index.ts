import {
  Client,
  Message,
  Partials,
} from "discord.js";
import { env } from "./env";
import { request } from 'undici';
import { IntentsBitField } from "discord.js";
import { start } from "repl";

import { activate } from "./commands";
import { URL } from "url";

const clinetOptions = {
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
};
const onMessage = async (msg: Message) => {
  if (msg.author.bot)
    return;
  let postId: string = '';
  const shortLink = msg.content.match(/https?:\/\/(?:vt\.tiktok\.com|(?:www\.|)tiktok\.com\/t)\/[a-zA-Z0-9]+/)?.at(0);
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
  if (msg.content.indexOf(' ') === -1)
    msg.delete().catch(() => { });
  else msg.suppressEmbeds().catch(() => { });
  await msg.channel.send({
    content: `
Requested by ${msg.author}
${env.FRONTEND_URL}/v/${postId}/embed
${env.FRONTEND_URL}/v/${postId}/video
`.trim(),
    allowedMentions: { users: [] },
  });
}

const client = new Client(clinetOptions);
client.on('ready', () => console.log('Logged in as', client.user!.tag));
client.on('messageCreate', onMessage);
client.on('error', console.error);

(async () => {
  const clients: Client[] = [];
  await activate(client);
  await client.login(env.DISCORD_TOKEN)
    .then(() => clients.push(client));
  for (const [index, token] of Object.entries(env.EXTRA_DISCORD_TOKENS)) {
    const client = new Client(clinetOptions);
    client.on('ready', () => console.log('Logged in as', client.user!.tag));
    client.on('messageCreate', onMessage);
    client.on('error', console.error);
    await client.login(token)
      .then(() => clients.push(client))
      .catch(() => console.error(`Failed to login extra token in index ${index}`));
  }
  if (!env.ENABLE_REPL)
    return;
  const repl = start();
  repl.once('exit', () => clients.map(client => client.destroy()));
  repl.context.client = client;
})();
