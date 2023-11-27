import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Events,
  Guild,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  MessageActionRowComponentBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { isEnabled, setEnabled } from "../config";

export default {
  data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Configure bot behaviour')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async activate(client: Client) {
    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isButton())
        return;
      if (!interaction.customId.startsWith('configure.'))
        return;
      if (!interaction.guild)
        return;
      if (interaction.message.partial)
        await interaction.message.fetch();
      const [, provider] = interaction.customId.split('.');
      await setEnabled(
        interaction.guild.id,
        provider,
        !await isEnabled(interaction.guild.id, provider),
      );
      interaction.update(await makeReply(interaction.guild));
    });
  },
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild)
      return;
    await interaction.reply(await makeReply(interaction.guild));
  },
  async onError(interaction: ChatInputCommandInteraction, error: Error) {
    await interaction.reply({
      content: `
There seems to be an error running this command. We apologize for the inconvenience and encourage you to try again later or contact our support team for assistance.

Here's the error we received:
\`${error.message}\`
`,
      ephemeral: true,
    });
  },
};

async function makeReply(guild: Guild): Promise<InteractionReplyOptions & InteractionUpdateOptions> {
  const [
    tiktok,
    instagram,
    twitch,
  ] = await Promise.all([
    isEnabled(guild.id, 'tiktok'),
    isEnabled(guild.id, 'instagram'),
    isEnabled(guild.id, 'twitch'),
  ]);
  return {
    embeds: [
      new EmbedBuilder()
        .setColor('#fe2c55')
        .setTitle('Intergrations')
        .addFields([
          {
            name: 'TikTok',
            value: tiktok ? 'Enabled' : 'Disabled',
            inline: true,
          },
          {
            name: 'Instagram',
            value: instagram ? 'Enabled' : 'Disabled',
            inline: true,
          },
          {
            name: 'Twitch',
            value: twitch ? 'Enabled' : 'Disabled',
            inline: true,
          },
        ]),
    ],
    components: [
      new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Toggle TikTok')
            .setCustomId('configure.tiktok'),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Toggle Instagram')
            .setCustomId('configure.instagram'),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Toggle Twitch')
            .setCustomId('configure.twitch'),
        ),
    ],
    ephemeral: true,
  };
}
