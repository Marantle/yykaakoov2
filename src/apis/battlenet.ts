import { CharacterMedia } from 'types/battlenet/CharacterMedia'
import { MythicPlusProgress } from 'types/battlenet/MythicPlusProgress'
import { getAccessToken } from './auth'
import logger from 'util/logger'
import { Roster } from 'types/battlenet/Roster'
import { Equipment } from 'types/battlenet/Equipment'

const mythicUrl = async (realm: string, character: string, region: string) =>
  `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/mythic-keystone-profile?namespace=profile-${region}&locale=en_US&access_token=${await getAccessToken()}`

export const getMythicPlusProgress = async (
  realm: string,
  character: string,
  region = 'eu'
) => {
  logger.info({ msg: 'getting m+ progress', realm, character })
  const mytchicPlusProgress: MythicPlusProgress = await (
    await fetch(
      await mythicUrl(realm.toLowerCase(), character.toLowerCase(), region),
      options
    )
  ).json()
  return mytchicPlusProgress
}

const mediaUrl = async (realm: string, character: string, region: string) =>
  `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/character-media?namespace=profile-${region}&locale=en_US&access_token=${await getAccessToken()}`
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
}

export const getCharacterMedia = async (
  realm: string,
  character: string,
  region = 'eu'
) => {
  logger.info('getting character media', realm, character)
  const media: CharacterMedia = await (
    await fetch(
      await mediaUrl(realm.toLowerCase(), character.toLowerCase(), region),
      options
    )
  ).json()
  return media
}

const guildUrl = async (realm: string, guild: string, region: string) =>
  `https://eu.api.blizzard.com/data/wow/guild/${realm}/${guild}/roster?namespace=profile-${region}&locale=en_US&access_token=${await getAccessToken()}`

export const getGuildRoster = async (
  realm: string,
  guild: string,
  region = 'eu'
) => {
  logger.info(
    'getting guild roster, realm: ' +
      realm +
      ' guild: ' +
      guild +
      ' ' +
      (await guildUrl(realm.toLowerCase(), guild.toLowerCase(), region))
  )
  const roster: Roster = await (
    await fetch(
      await guildUrl(realm.toLowerCase(), guild.toLowerCase(), region),
      options
    )
  ).json()
  return roster
}

const equipmentUrl = async (realm: string, character: string, region: string) =>
  `https://eu.api.blizzard.com/profile/wow/character/${realm}/${character}/equipment?namespace=profile-${region}&locale=en_US&access_token=${await getAccessToken()}`

export const getEquipmentForCharacter = async (
  realm: string,
  character: string,
  region = 'eu'
) => {
  // logger.info('getting equipment ' + realm + ' ' + character)
  const equipment: Equipment = await (
    await fetch(
      await equipmentUrl(realm.toLowerCase(), character.toLowerCase(), region),
      options
    )
  ).json()
  if (!equipment?.character?.name) {
    logger.info('did not get equipment for ' + character)
    return
  }
  // logger.info('got equipment for ' + equipment.character.name)
  return equipment
}

export const getEquipmentForRoster = async (roster: Roster, region = 'eu') => {
  const members = roster.members
  //sort members by rank ascending
  const sortedByRank = members.sort((a, b) => a.rank - b.rank).slice(0, 20)
  // wait 1 second every 50 fetchs
  const equipment: (Equipment | undefined)[] = await Promise.all(
    sortedByRank.map(async (member, index) => {
      if (index % 50 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
      return await getEquipmentForCharacter(
        member.character.realm.slug,
        member.character.name,
        region
      )
    })
  )
  //clean up undefined
  return equipment.filter((e) => e) as Equipment[]
}

export const getIlvlForEveryone = async (
  realm: string,
  guild: string,
  region = 'eu'
) => {
  const roster = await getGuildRoster(realm, guild, region)
  const equipment = await getEquipmentForRoster(roster, region)
  // average itemlevels with char name
  const itemLevels = equipment.map((e) => {
    const ilvl = e.equipped_items.reduce(
      (acc, item) => acc + item.level.value,
      0
    )
    return {
      name: e.character.name,
      ilvl: (ilvl / e.equipped_items.length).toFixed(2),
    }
  })
  return itemLevels
}
