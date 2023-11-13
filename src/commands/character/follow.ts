import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder } from 'discord.js'
import { characterOption, realmOption, regionOptions } from '../options.ts'
import { addToFollowedList } from 'db/operations/characteroperations.ts'
import logger from 'util/logger.ts'
import { realms } from 'commands/mythic/realmnames.ts'
import { buildEmbedFromStringArray, c } from 'util/utils.ts'
import mongoose, { MongooseError } from 'mongoose'

const follow: Command = {
  data: new SlashCommandBuilder()
    .setName('follow')
    .setDescription(
      'Add someone to your followed, characters in this list will be used with other similar commands'
    )
    .addStringOption(characterOption())
    .addStringOption(realmOption())
    .addStringOption(regionOptions()),
  async execute(interaction) {
    const character = interaction.options.getString('character')!
    const realm = interaction.options.getString('realm')!
    const region = interaction.options.getString('region') ?? 'eu'

    try {
      const upserted = await addToFollowedList(
        interaction.user.id,
        character,
        realm,
        region
      )
      const embed = buildEmbedFromStringArray(
        upserted!.followed.map(
          (f) =>
            `${c(f.characterName)}-${
              realms[f.realm]
            }-${f.region.toUpperCase()} `
        )
      )
      return await interaction.reply({
        content: `<@${upserted?.discordUserId}>'s new followed list`,
        embeds: [embed],
        ephemeral: true,
      })
    } catch (e) {
      if (e instanceof mongoose.mongo.MongoError && e.code === 11000) {
        return await interaction.reply({
          content: `You are already following ${c(character)}-${
            realms[realm]
          } ${region.toUpperCase()}`,
          ephemeral: true,
        })
      } else {
        logger.info(e)
        return await interaction.reply({
          content: `Something went wrong, try again later`,
          ephemeral: true,
        })
      }
    }
  },
}

export default follow

