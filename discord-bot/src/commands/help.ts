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
    // await client.application!.fetch();
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client;
    const components = [];
    if (env.SUPPORT_SERVER_INVITE_LINK)
      components.push(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Support Server')
          .setURL(env.SUPPORT_SERVER_INVITE_LINK)
      );
    if (client.application.installParams)
      components.push(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Bot Invite Link')
          .setURL(client.generateInvite(client.application.installParams))
      );
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#fe2c55')
          .setDescription(`${client.user} is a discord bot written by Khoo Hao Yit`)
          .addFields([
            {
              name: 'How to use',
              value: 'Send a message that contains a tiktok link, the bot will try and delete the message and sends a message that allows user to view the video in discord',
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
          .addComponents(...components),
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
