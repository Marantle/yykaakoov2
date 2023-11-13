import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../commandTypes.ts'
import { characterOption, realmOption } from '../options.ts'
import { saveMain } from 'db/operations/characteroperations.ts'
import { realms } from 'commands/mythic/realmnames.ts'
import logger from 'util/logger.ts'
import { c } from 'util/utils.ts'

const setMain: Command = {
  data: new SlashCommandBuilder()
    .setName('setmain')
    .setDescription('Save your main for use with other commands')
    .addStringOption(characterOption())
    .addStringOption(realmOption()),
  async execute(interaction) {
    const character = interaction.options.getString('character')!
    const realm = interaction.options.getString('realm')!
    logger.info(interaction.user.id, interaction.commandName, character, realm)
    if (!realms[realm.toLowerCase()]) {
      return await interaction.reply({
        content: `Realm ${realm} not found`,
      })
    }

    const formattedRealm = realms[realm.toLowerCase()]
    logger.info({ formattedRealm })
    const upserted = await saveMain(
      interaction.user.id,
      character,
      formattedRealm
    )

    return await interaction.reply({
      content: `<@${upserted?.discordUserId}>'s new main is ${c(
        upserted?.characterName
      )}-${upserted!.realm}`,
      ephemeral: true,
    })
  },
}

export default setMain
