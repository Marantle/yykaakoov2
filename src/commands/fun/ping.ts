import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder } from 'discord.js'

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    return await interaction.reply({content: 'Pong! ', ephemeral: true})
  },
}

export default ping
