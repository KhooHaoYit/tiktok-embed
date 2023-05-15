import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from "discord.js";
import { env } from "../env";

export default {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest a feature to the developers')
    .addStringOption(option => option
      .setName('title')
      .setDescription('The title of the suggestion')
      .setMaxLength(100)
      .setRequired(true))
    .addStringOption(option => option
      .setName('description')
      .setDescription('The description of the suggestion')
      .setMaxLength(2000)
      .setRequired(true))
    .addAttachmentOption(option => option
      .setName('attachment')
      .setDescription('The attachment of the suggestion')),
  async activate(client: Client) {
    if (!env.SUGGESTION_CHANNEL_ID)
      throw new Error(`SUGGESTION_CHANNEL_ID is undefined`);
    const suggestionChannel = await client.channels.fetch(env.SUGGESTION_CHANNEL_ID);
    if (!suggestionChannel)
      throw new Error(`Suggestion channel does not exists`);
    if (suggestionChannel.type !== ChannelType.GuildForum)
      throw new Error(`Suggestion channel is not type 'GuildForum'`);
    if (!suggestionChannel.availableTags.find(tag => tag.name === 'Untagged'))
      throw new Error(`Suggestion channel does not have tag 'Untagged'`);
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const suggestionChannel = await interaction.client.channels.fetch(env.SUGGESTION_CHANNEL_ID!);
    if (!suggestionChannel || suggestionChannel.type !== ChannelType.GuildForum)
      return;
    const name = interaction.options.getString('title')!;
    const content = interaction.options.getString('description')!;
    const attachment = interaction.options.getAttachment('attachment');
    const tagId = suggestionChannel.availableTags.find(tag => tag.name === 'Untagged')?.id;
    if (!tagId)
      return;
    await suggestionChannel.threads.create({
      name,
      message: {
        content,
        files: attachment ? [attachment] : [],
      },
      appliedTags: [tagId],
    });
    await interaction.reply({
      content: 'Thank you for taking the time to send us your suggestion. Your input is greatly appreciated as we strive to improve and enhance our bot for a better user experience.',
      ephemeral: true,
    });
  },
  async onError(interaction: ChatInputCommandInteraction, error: Error) {
    await interaction.reply({
      content: `
There seems to be an error submitting your suggestion. We apologize for the inconvenience and encourage you to try again later or contact our support team for assistance.

Here's the error we received:
\`${error.message}\`
`,
      ephemeral: true,
    });
  },
};
