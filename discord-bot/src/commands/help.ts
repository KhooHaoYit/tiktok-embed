import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { env } from "../env";

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display information about the bot'),
  async activate(client: Client) {
    const application = await client.application!.fetch();
    if (!application.installParams)
      console.warn(`\`application.installParams\` is null, issue might occur when generating bot invite link`);
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#fe2c55')
          .setDescription(`${client.user} is a discord bot written by Khoo Hao Yit`)
          .addFields([
            {
              name: 'How to use',
              value: 'Send a message that contains a tiktok link, the bot will try and suppress the embed and sends a message that allows user to view the video in discord',
            },
            {
              name: 'Got question, suggestion, or bug?',
              value: `Feel free to join the support server below`,
            },
            { name: 'Servers', value: client.guilds.cache.size.toLocaleString('en'), inline: true },
            { name: 'Bootup', value: `<t:${Math.round(Date.now() / 1_000 - process.uptime())}:R>`, inline: true },
            { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
          ]),
      ],
      components: [
        new ActionRowBuilder<MessageActionRowComponentBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel('Support Server')
              .setURL(env.SUPPORT_SERVER_INVITE_LINK),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel('Bot Invite Link')
              .setURL(client.generateInvite(client.application!.installParams!)),
          ),
      ],
      ephemeral: true,
    });
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
