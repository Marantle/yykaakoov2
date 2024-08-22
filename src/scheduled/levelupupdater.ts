import * as cron from 'node-cron'
import { getGuildRoster } from 'apis/battlenet.js'
import config from '../config/config.ts'
import { Levelcounts } from 'db/schemas/levelcounts.ts'
import { LevelupCharacter } from 'db/schemas/levelupcharacter.ts'
import logger from 'util/logger.ts'

const startLevelupUpdater = async () => {
  const updater = async () => {
    console.log('running updater')
    const { realm, name: guild, region } = config.guild
    const roster = await getGuildRoster(realm, guild, region)

    logger.info('updater got roster members ' + roster.members.length)
    const memberDatas = roster.members

    const wwLevels = memberDatas
      .filter((memberData) => memberData.character.level >= 1)
      .map((memberData) => {
        return {
          name: memberData.character.name,
          realm: memberData.character.realm.slug,
          level: memberData.character.level,
        }
      })
    logger.info('updater got people x ' + wwLevels.length)
    const oldLevels = await LevelupCharacter.find()
    const oldCounts = await Levelcounts.find()

    let newCharsAdded = 0
    let nowNewCharsAdded = 0
    wwLevels.forEach(async (wwLevel) => {
      const charactersOldLevel = oldLevels.find(
        (oldLevel) =>
          oldLevel.characterNameRealm === wwLevel.name + '-' + wwLevel.realm
      )
      const charactersCurrentLevel = wwLevel.level
      if (
        charactersOldLevel &&
        charactersOldLevel?.level < charactersCurrentLevel
      ) {
        logger.info(`Level increased for ${combine(wwLevel.name, wwLevel.realm)} from ${charactersOldLevel.level} to ${charactersCurrentLevel}`)
        await Promise.all([
          Levelcounts.findOneAndUpdate(
            { level: charactersCurrentLevel },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
          ),
          LevelupCharacter.findOneAndUpdate(
            { characterNameRealm: combine(wwLevel.name, wwLevel.realm) },
            { $set: { level: charactersCurrentLevel } },
            { new: true, upsert: true }
          ),
        ])
      } else if (!charactersOldLevel) {
        newCharsAdded++
        await Promise.all([
          Levelcounts.findOneAndUpdate(
            { level: charactersCurrentLevel },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
          ),
          LevelupCharacter.findOneAndUpdate(
            { characterNameRealm: combine(wwLevel.name, wwLevel.realm) },
            { $set: { level: charactersCurrentLevel } },
            { new: true, upsert: true }
          ),
        ])
      } else {
        nowNewCharsAdded++
      }
    })

    logger.info(
      `added ${newCharsAdded} new characters to db, ${nowNewCharsAdded} characters already in db`
    )

    //   await Levelcounts.findOneAndUpdate(
    //     {
    //       level: 1,
    //     },
    //     { $inc: { count: 1 } },
    //     { new: true, upsert: true }
    //   )

    //   return await Levelcounts.findOne(
    //     { discordUserId: userId },
    //     { followed: 1, _id: 0 }
    //   )
    //   levelUpRef.once('value', (snapshot) => {
    //     for (let index = 0; index < wwLevels.length; index++) {
    //       const charName = wwLevels[index].name
    //       const charLevel = wwLevels[index].level
    //       if (snapshot.hasChild(charName)) {
    //         if (snapshot.child(charName).val() < charLevel) {
    //           levelUpRef.child(charName).set(charLevel)
    //         }
    //       } else {
    //         levelUpRef.child(charName).set(charLevel)
    //       }
    //     }
    //   })
    // } catch (error) {
    //   log.error(error)
  }
  updater()
  try {
    cron.schedule('*/15 * * * *', updater)
  } catch (error) {
    console.log(error)
  }
}

const combine = (name: string, realm: string) => {
  return name + '-' + realm
}
export default startLevelupUpdater
