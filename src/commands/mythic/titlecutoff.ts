import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder } from 'discord.js'

const titlecutoff: Command = {
  data: new SlashCommandBuilder()
    .setName('titlecutoff')
    .setDescription('Returns the currently calculated title cutoff with extreme accuracy'),
  async execute(interaction) {
    const timetil = Math.floor(
      (new Date('2023-11-07T00:00:00.000Z').getTime() - new Date().getTime()) /
        1000 /
        60
    )
    const days = timetil / 60 / 24
    const cutoff = 3691 - days

    return await interaction.reply({
      content: `Predicted title cutoff for eu: ${cutoff.toFixed(1)}`,
    })
  },
}

export default titlecutoff
