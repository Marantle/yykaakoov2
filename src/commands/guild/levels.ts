import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../commandTypes.ts'
import { realms } from 'commands/mythic/realmnames.ts'
import logger from 'util/logger.ts'
import { getGuildRoster } from 'apis/battlenet.ts'
import { Levelcounts } from 'db/schemas/levelcounts.ts'

const levels: Command = {
  data: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('Get all levels in guild'),

  async execute(interaction) {
    const guild = 'beyond-harmless'
    const realm = 'sylvanas'
    logger.info(interaction.user.id, interaction.commandName, guild, realm)
    if (!realms[realm.toLowerCase()]) {
      return await interaction.reply({
        content: `Realm ${realm} not found`,
      })
    }
    await interaction.deferReply({ ephemeral: true })
    const allItemLevels = await getGuildRoster(realm, guild, 'eu')
    
    await Levelcounts.findOneAndUpdate(
      {
        level: 1,
      },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    )

    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(' ')
          .addFields({ name: 'Some levels', value: '555' }),
      ],
      content: `${'```'}${JSON.stringify('cool text', null, 2)}${'```'}`,
    })
  },
}

export default levels
