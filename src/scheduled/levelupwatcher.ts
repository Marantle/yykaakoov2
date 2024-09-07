import { LevelupCharacter } from 'db/schemas/levelupcharacter.ts'
import { Levelcounts } from 'db/schemas/levelcounts'
import logger from 'util/logger'
import { Client, TextChannel } from 'discord.js'
import { ENV } from 'util/env'
const levelupWatcher = LevelupCharacter.watch()

export interface ChangeBase {
  _id: ID
  operationType: string
  clusterTime: ClusterTime
  wallTime: Date
  ns: NS
  documentKey: DocumentKey
}

export interface ChangeInsert extends ChangeBase {
  operationType: 'insert'
  fullDocument: FullDocument
  updateDescription?: never
}

export interface ChangeUpdate extends ChangeBase {
  operationType: 'update'
  fullDocument?: never
  updateDescription?: UpdateDescription
}

export type Change = ChangeInsert | ChangeUpdate

export interface ID {
  _data: string
}

export interface ClusterTime {
  $timestamp: string
}

export interface DocumentKey {
  _id: string
}

export interface FullDocument {
  _id: string
  characterNameRealm: string
  level: number
}

export interface NS {
  db: string
  coll: string
}

export interface UpdateDescription {
  updatedFields: UpdatedFields
  removedFields: any[]
  truncatedArrays: any[]
}

export interface UpdatedFields {
  level: number
}

const { levelupChannel } = ENV
export default (client: Client<boolean>) => {
  levelupWatcher.on('change', (change: Change) => {
    logger.info('change detected', change)

    if (change.operationType === 'insert') {
      logger.info(
        `new character added: ${change.fullDocument?.characterNameRealm}`
      )
    }
    if (change.operationType === 'update') {
      Levelcounts.findOne({
        level: change.updateDescription?.updatedFields.level,
      }).then((levelCount) => {
        // log how many times this level has been reached
        logger.info(
          `level ${change.updateDescription?.updatedFields.level}, count, ${levelCount?.count}`
        )
        LevelupCharacter.findById(change.documentKey._id).then((character) => {
          if (character) {
            let message = `Ding! ${
              character.characterNameRealm.split('-')[0]
            } saavutti tason ${
              change.updateDescription?.updatedFields.level ?? '?'
            }, hän oli ${levelCount?.count ?? '?'}. tason ${
              levelCount?.level ?? '?'
            } seikkailija!`
            if (change.updateDescription?.updatedFields.level === 80) {
              message += ' Onneksi olkoon! Olet saavuttanut maksimitason! 🎉'
              if (levelCount?.count === 1) {
                message +=
                  ' https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm8zcGhiNnJxNmpzd3E3NG95cWN3cGp4NGRta2VpdzNhbmQweTQ3ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NaxKt9aSzAspO/giphy.webp'
              }
            }
            logger.info(`levelupChannel: ${levelupChannel}`)
            if (change.updateDescription?.updatedFields.level === 80) {
              client.channels
                .fetch(levelupChannel)
                .then((channel) => {
                  const textChannel = channel as TextChannel
                  textChannel
                    .send(message)
                    .then(() => logger.info(`message sent: ${message}`))
                    .catch((error) =>
                      logger.error(`Failed to send message: ${error}`)
                    )
                  logger.info(`message sent message: ${message}`)
                })
                .catch((error) => {
                  logger.error(`Failed to fetch the channel: ${error}`)
                })
            }
          }
        })
      })
    }
  })
}
