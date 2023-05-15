import { createEnv } from "@t3-oss/env-core";
import { z } from 'zod';

export const env = createEnv({
  server: {
    DISCORD_TOKEN: z.string(),
    EXTRA_DISCORD_TOKENS: z
      .string()
      .default('')
      .transform(tokens => tokens
        .split(',')
        .filter(token => token)),
    FRONTEND_URL: z.string(),
    INTERNAL_FRONTEND_URL: z.string(),
    SUGGESTION_CHANNEL_ID: z.string().optional(),
    SUPPORT_SERVER_INVITE_LINK: z.string().optional(),
    ENABLE_REPL: z.coerce.boolean().default(false),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: '',
});
