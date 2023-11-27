import {
  Client,
  Message,
  Partials,
} from "discord.js";
import { env } from "./env";
import { IntentsBitField } from "discord.js";
import { start } from "repl";

import {
  Integrations,
  autoDiscoverNodePerformanceMonitoringIntegrations,
  captureException,
  getCurrentHub,
  init,
  startTransaction,
} from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import {
  activate as tiktokActivate,
  onMessage as tiktokOnMessage,
} from "./providers/tiktok";
import {
  activate as instagramActivate,
  onMessage as instagramOnMessage,
} from "./providers/instagram";
import {
  activate as twitchActivate,
  onMessage as twitchOnMessage,
} from "./providers/twitch";
import { activate } from "./commands";
import { isEnabled } from "./config";

if (env.SENTRY_DSN)
  init({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT,
    integrations: [
      new Integrations.Http({ tracing: true }),
      new ProfilingIntegration(),
      new Integrations.LocalVariables({
        captureAllExceptions: true,
      }),
      ...autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],
    tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
    profilesSampleRate: env.SENTRY_PROFILES_SAMPLE_RATE,
    includeLocalVariables: true,
  });


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
  if (msg.author.bot || !msg.guild)
    return;
  const tx = startTransaction({
    op: "transaction",
    name: "HandleMessage",
  });
  getCurrentHub()
    .configureScope(scope => scope.setSpan(tx));
  let hasError = false;
  let totalEmbeded = 0;
  const onResults = (results: PromiseSettledResult<number>[]) => {
    for (const result of results) {
      if (result.status === 'rejected') {
        captureException(result.reason);
        hasError = true;
        continue;
      }
      totalEmbeded += result.value;
    }
  }

  await Promise.allSettled([
    isEnabled(msg.guild.id, 'instagram').then(async enabled => {
      if (!enabled)
        return;
      await instagramOnMessage(msg)
        .then(onResults);
    }),
    isEnabled(msg.guild.id, 'tiktok').then(async enabled => {
      if (!enabled)
        return;
      await tiktokOnMessage(msg)
        .then(onResults);
    }),
    isEnabled(msg.guild.id, 'twitch').then(async enabled => {
      if (!enabled)
        return;
      await twitchOnMessage(msg)
        .then(onResults);
    }),
  ]);

  if (hasError)
    msg.react('🔥').catch(() => { });
  if (
    msg.content.indexOf(' ') === -1
    && totalEmbeded === 1
    && msg.deletable
  ) await msg.delete().catch(() => { });
  else if (totalEmbeded)
    await msg.suppressEmbeds().catch(() => { });
  tx.finish();
}

const setup = (client: Client) => {
  client.on('ready', () => console.log('Logged in as', client.user!.tag));
  client.on('messageCreate', onMessage);
  client.on('error', err => {
    captureException(err);
    console.error(err);
  });
  tiktokActivate(client);
  instagramActivate(client);
  twitchActivate(client);
}

const client = new Client(clinetOptions);
setup(client);
activate(client);

(async () => {
  const clients: Client[] = [];
  await client.login(env.DISCORD_TOKEN)
    .then(() => clients.push(client));

  for (const [index, token] of Object.entries(env.EXTRA_DISCORD_TOKENS)) {
    const client = new Client(clinetOptions);
    setup(client);
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
