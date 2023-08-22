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
    // Tiktok
    TIKTOK_API_URL: z.string(),
    // Instagram
    INSTAGRAM_API_URL: z.string(),
    INSTAGRAM_API_ACCESS_TOKEN: z
      .string()
      .optional(),
    // Sentry
    SENTRY_DSN: z.string().optional(),
    SENTRY_ENVIRONMENT: z.enum(['local', 'production']).default('local'),
    SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
    SENTRY_PROFILES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: '',
});
