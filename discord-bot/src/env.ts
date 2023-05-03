import { createEnv } from "@t3-oss/env-core";
import { z } from 'zod';

export const env = createEnv({
  server: {
    DISCORD_TOKEN: z.string(),
    FRONTEND_URL: z.string(),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: '',
});
