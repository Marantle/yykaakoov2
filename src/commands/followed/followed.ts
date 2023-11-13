import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder } from 'discord.js'
import { characterOption, realmOption, regionOptions } from '../options.ts'
import { addToFollowedList, getMain } from 'db/operations/characteroperations.ts'
import logger from 'util/logger.ts'
import { realms } from 'commands/mythic/realmnames.ts'
import { buildEmbedFromStringArray, c } from 'util/utils.ts'
import mongoose, { MongooseError } from 'mongoose'
import { getMythicPlusProgress } from 'apis/battlenet.ts'

//this command returns the list of followed characters
const followed: Command = {
  data: new SlashCommandBuilder()
    .setName('followed')
    .setDescription(
      'Get your followed characters, characters in this list will be used with other similar commands'
    ),
  async execute(interaction) {
    const main = await getMain(interaction.user.id)!
    if (!main) {
      return await interaction.reply({
        content: `No main found for <@${interaction.user.id}>. Use /setmain to set your main`,
        ephemeral: true,
      })
    }
    
    const embed = buildEmbedFromStringArray(
      main!.followed.map(
        (f) =>
          `${c(f.characterName)}-${realms[f.realm]}-${f.region.toUpperCase()} `
      )
    )
    return await interaction.reply({
      content: `<@${main?.discordUserId}>'s followed list`,
      embeds: [embed],
      ephemeral: true,
    })
  },
}

export default followed
