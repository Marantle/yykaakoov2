import { ChatInputCommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js"

export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  execute: (interaction: ChatInputCommandInteraction) => Promise<InteractionResponse<boolean>>
}
