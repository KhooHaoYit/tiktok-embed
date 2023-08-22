import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient;

export async function isEnabled(guildId: string, provider: string) {
  return await prisma.guild.findUnique({
    where: { id: guildId },
  }).then(res => !(<Config | undefined>res?.config)?.disabled.includes(provider));
}

export async function setEnabled(guildId: string, provider: string, enable = true) {
  let { disabled } = await prisma.guild.findUnique({
    where: { id: guildId },
    select: { config: true },
  }).then(res => <Config | undefined>res?.config ?? { disabled: [] });

  if (enable && disabled.includes(provider))
    disabled = disabled.filter(p => p !== provider);
  else if (!enable && !disabled.includes(provider))
    disabled = [...disabled, provider];

  const config = { disabled };
  await prisma.guild.upsert({
    where: { id: guildId },
    update: {
      config,
    },
    create: {
      id: guildId,
      config,
    },
  });
}

type Config = {
  disabled: string[],
};
