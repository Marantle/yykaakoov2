import { Command } from 'commands/commandTypes.ts'
import { GuildMember, SlashCommandBuilder } from 'discord.js'

const user: Command = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const member = <GuildMember>interaction.member
    return await interaction.reply({
      content: `This command was run by ${
        interaction.user.username
      }, who joined on ${(<GuildMember>interaction.member).joinedAt}.`,
      ephemeral: true,
    })
  },
}

export default user
