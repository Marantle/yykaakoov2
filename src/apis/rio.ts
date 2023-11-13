import { CurrentScores as CurrentRatings } from 'types/rio/CurrentScores'
import logger from 'util/logger'

const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  }

const scoreUrl = async (realm: string, character: string) =>
  `https://raider.io/api/v1/characters/profile?region=eu&realm=${realm}&name=${character}&fields=mythic_plus_scores_by_season%3Acurrent`

export const getCurrentScores = async (
  realm: string,
  character: string
) => {
  logger.info('getting m+ progress', realm, character)
  const scores: CurrentRatings = await (
    await fetch(await scoreUrl(realm.toLowerCase(), character.toLowerCase()), options)
  ).json()
  return scores
}

