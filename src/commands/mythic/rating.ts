import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { realms } from './realmnames'
import { characterOption, realmOption, regionOptions } from '../options'
import { getMain } from 'db/operations/characteroperations.ts'
import { getCurrentScores as getCurrentRatings } from 'apis/rio'
import { CurrentScores } from 'types/rio/CurrentScores'

const weekly: Command = {
  data: new SlashCommandBuilder()
    .setName('rating')
    .setDescription(
      'Get your mains rio, or give realm and character to get anyones'
    )
    .addStringOption(characterOption(false))
    .addStringOption(realmOption(false))
    .addStringOption(regionOptions(false)),
  execute: async (interaction) => {
    let realm = interaction.options.getString('realm')
    let character = interaction.options.getString('character')
    const region = interaction.options.getString('region') ?? 'eu'
    if (realm && !realms[realm.toLocaleLowerCase()]) {
      return await interaction.reply({
        content: `Given realm ${realm} not found`,
        ephemeral: true,
      })
    }

    if (!realm && !character) {
      const user = await getMain(interaction.user.id)
      realm = user?.realm ?? null
      character = user?.characterName ?? null
    }

    if (!realm || !character) {
      return await interaction.reply({
        content: `Supply both, character and its realm, or use /setmain to set your main`,
        ephemeral: true,
      })
    }

    const currentRatings = await getCurrentRatings(realm, character, region)

    if (
      currentRatings.hasOwnProperty('statusCode') &&
      currentRatings.statusCode === 400
    ) {
      return await interaction.reply({
        content: `${currentRatings.message}, character ${character} on realm ${realm} not found`,
        ephemeral: true,
      })
    }
    const rioEmbed = buildRioEmbed(
      currentRatings,
      character,
      currentRatings.thumbnail_url
    )

    return await interaction.reply({
      embeds: [rioEmbed],
      ephemeral: !interaction.options.getString('realm') && !interaction.options.getString('character'),
    })
  },
}

function buildRioEmbed(
  mytchicPlusProgress: CurrentScores,
  character: string,
  thumbnail: string
) {
  const topKeys = mytchicPlusProgress.mythic_plus_scores_by_season[0].scores
  const msg =
    '```' +
    `
All:    ${topKeys.all}
DPS:    ${topKeys.dps > 0 ? topKeys.dps : 'N/A'}
Healer: ${topKeys.healer > 0 ? topKeys.healer : 'N/A'}
Tank:   ${topKeys.tank > 0 ? topKeys.tank : 'N/A'}
Spec 1: ${topKeys.spec_0 > 0 ? topKeys.spec_0 : 'N/A'}
Spec 2: ${topKeys.spec_1 > 0 ? topKeys.spec_1 : 'N/A'}
Spec 3: ${topKeys.spec_2 > 0 ? topKeys.spec_2 : 'N/A'}
Spec 4: ${topKeys.spec_3 > 0 ? topKeys.spec_3 : 'N/A'}
` +
    '```'
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      'Rio for ' + character.charAt(0).toUpperCase() + character.slice(1)
    )
    .setThumbnail(thumbnail)
    .addFields({ name: ' ', value: msg })
    .addFields({ name: ' ', value: `[Raider.io profile](${mytchicPlusProgress.profile_url})` })

  return embed
}

export default weekly
