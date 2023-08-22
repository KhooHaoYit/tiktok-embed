import {
  ChatInputCommandInteraction,
  Client,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

import configure from "./commands/configure";
import help from "./commands/help";
import suggest from "./commands/suggest";

const commands = {
  configure,
  help,
  suggest,
} as Record<string, {
  activate: (client: Client) => Promise<void>,
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
  onError: (interaction: ChatInputCommandInteraction, error: Error) => Promise<void>,
}>;

export function activate(client: Client) {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand())
      return;
    const commandHandler = commands[interaction.commandName];
    if (!commandHandler)
      return;
    const {
      execute,
      onError,
    } = commandHandler;
    await execute(interaction)
      .catch((err: Error) => onError(interaction, err));
  });
  client.once('ready', async () => {
    const commandEntries = await Promise.all(
      Object.entries(commands)
        .map(entry => entry[1].activate(client)
          .then(() => entry)
          .catch(console.warn)))
      .then(commands => commands.filter(Boolean));
    await new REST().setToken(client.token!).put(
      Routes.applicationCommands(client.user!.id),
      { body: commandEntries.map(command => command![1].data.toJSON()) },
    );
  });
}
