import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../commandTypes.ts'
import { realms } from 'commands/mythic/realmnames.ts'
import logger from 'util/logger.ts'
import { getIlvlForEveryone } from 'apis/battlenet.ts'

const itemlevel: Command = {
  data: new SlashCommandBuilder()
    .setName('itemlevel')
    .setDescription('Get all item levels in guild'),

  async execute(interaction) {
    const guild ='beyond-harmless'
    const realm = 'sylvanas'
    logger.info(interaction.user.id, interaction.commandName, guild, realm)
    if (!realms[realm.toLowerCase()]) {
      return await interaction.reply({
        content: `Realm ${realm} not found`,
      })
    }
    await interaction.deferReply({ ephemeral: true })
    const allItemLevels = await getIlvlForEveryone(guild, realm)
    const embed = buildItemLevelEmbed(allItemLevels)
    return await interaction.editReply({
      embeds: [embed],
      content: `${'```'}${JSON.stringify(allItemLevels, null, 2)}${'```'}`,
    })
  },
}

function buildItemLevelEmbed(
  allItemLevels: {
    name: string
    ilvl: string
  }[]
) {
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('Some item levels')
    .addFields(
      allItemLevels.map((ilvl) => ({
        name: ilvl.name,
        value: ilvl.ilvl,
        inline: true,
      }))
    )
  return embed
}
export default itemlevel
