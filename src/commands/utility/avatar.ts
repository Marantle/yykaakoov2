import { Command } from 'commands/commandTypes.ts'
import { CommandInteraction, SlashCommandBuilder } from 'discord.js'

const avatar: Command = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription(
      'Get the avatar URL of the selected user, or your own avatar.'
    )
    .addUserOption((option) =>
      option.setName('target').setDescription("The user's avatar to show")
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('target')
    if (user)
      return await interaction.reply(
        `${user.username}'s avatar: ${user.displayAvatarURL()}`
      )
    return await interaction.reply(
      `Your avatar: ${interaction.user.displayAvatarURL()}`
    )
  },
}

export default avatar
