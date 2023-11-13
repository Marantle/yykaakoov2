import { CharacterMedia } from 'types/battlenet/CharacterMedia'
import { MythicPlusProgress } from 'types/battlenet/MythicPlusProgress'
import { getAccessToken } from './auth'
import logger from 'util/logger'

const mythicUrl = async (realm: string, character: string) =>
  `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/mythic-keystone-profile?namespace=profile-eu&locale=en_US&access_token=${await getAccessToken()}`

export const getMythicPlusProgress = async (
  realm: string,
  character: string
) => {
  logger.info('getting m+ progress', realm, character)
  const mytchicPlusProgress: MythicPlusProgress = await (
    await fetch(await mythicUrl(realm.toLowerCase(), character.toLowerCase()), options)
  ).json()
  return mytchicPlusProgress
}

const mediaUrl = async (realm: string, character: string) =>
  `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/character-media?namespace=profile-eu&locale=en_US&access_token=${await getAccessToken()}`
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}

export const getCharacterMedia = async (realm: string, character: string) => {
  logger.info('getting character media', realm, character)
  const media: CharacterMedia = await (
    await fetch(await mediaUrl(realm.toLowerCase(), character.toLowerCase()), options)
  ).json()
  return media
}
