import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder } from 'discord.js'

const ping: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns the currently calculated title cutoff'),
  async execute(interaction) {

    // minutes until november 7th 2023
    const timetil = Math.floor((new Date('2023-11-07T00:00:00.000Z').getTime() - new Date().getTime()) / 1000 / 60)
    return await interaction.reply({content: 'Pong! '})
  },
}

export default ping
