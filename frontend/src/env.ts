import { createEnv } from "@t3-oss/env-nextjs";
import { z } from 'zod';

export const env = createEnv({
  server: {
    TIKTOK_API_URL: z.string(),
    INSTAGRAM_API_URL: z.string(),
    INSTAGRAM_API_ACCESS_TOKEN: z
      .string()
      .optional(),
    TWITCH_API_URL: z.string(),
  },
  client: {},
  runtimeEnv: {
    TIKTOK_API_URL: process.env.TIKTOK_API_URL,
    INSTAGRAM_API_URL: process.env.INSTAGRAM_API_URL,
    INSTAGRAM_API_ACCESS_TOKEN: process.env.INSTAGRAM_API_ACCESS_TOKEN,
    TWITCH_API_URL: process.env.TWITCH_API_URL,
  },
});
