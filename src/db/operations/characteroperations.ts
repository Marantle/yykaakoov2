import { Character } from 'db/schemas/character'
import { ChatInputCommandInteraction } from 'discord.js'

export const saveMain = async (
  userId: string,
  character: string,
  realm: string
) => {
  return await Character.findOneAndUpdate(
    { discordUserId: userId },
    { $set: { characterName: character, realm } },
    { new: true, upsert: true }
  )
}

export const getMain = async (userId: string) => {
  return await Character.findOne({ discordUserId: userId })
}

export const addToFollowedList = async (
  userId: string,
  character: string,
  realm: string,
  region: string
) => {

  return await Character.findOneAndUpdate(
    {
      discordUserId: userId,
      followed: {
        $not: {
          $elemMatch: {
            characterName: character,
            realm,
            region,
          },
        },
      },
    },
    { $push: { followed: { characterName: character, realm, region } } },
    { new: true, upsert: true }
  )
}

//get only the followed field
export const getFollowedList = async (userId: string) => {
  return await Character.findOne(
    { discordUserId: userId },
    { followed: 1, _id: 0 }
  )
}