import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { getMain } from 'db/operations/characteroperations.ts'
import { getCurrentScores as getCurrentRatings } from 'apis/rio'
import { CurrentScores } from 'types/rio/CurrentScores'
import { buildEmbedFromStringArray } from 'util/utils'

const followedrating: Command = {
  data: new SlashCommandBuilder()
    .setName('followedrating')
    .setDescription(
      'Get your mains rio, or give realm and character to get anyones'
    ),
  execute: async (interaction) => {
    const character = await getMain(interaction.user.id)!

    if (!character || !character.followed || character.followed.length === 0) {
      return await interaction.reply({
        content: `No followed characters found for <@${interaction.user.id}>. Use /follow to follow a character`,
        ephemeral: true,
      })
    }
    // get current ratings for all followed characters, reject those with status code as 400
    const pendingRatings = await Promise.allSettled(
      character.followed.map(async (followed) => {
        const currentRating = await getCurrentRatings(
          followed.realm,
          followed.characterName,
          followed.region
        )
        if (currentRating.statusCode === 400) {
          return Promise.reject(currentRating)
        }
        return currentRating
      })
    )

    //filter out rejected promises
    const successfullRatings = pendingRatings.filter(
      (currentRating) => currentRating.status === 'fulfilled'
    ) as PromiseFulfilledResult<CurrentScores>[]

    const currentRatings = successfullRatings.map((rating) => rating.value)

    const ar = currentRatings.map((cr) => {
      return `${(cr.name + '-' + cr.realm + ' ' + cr.region).padEnd(35, ' ')} ${
        cr.mythic_plus_scores_by_season[0].scores.all
      }`
    })

    const embed = buildEmbedFromStringArray(ar, 'Your followed characters m+ ratings')

    return await interaction.reply({
      embeds: [embed],
    })
  },
}

export default followedrating
