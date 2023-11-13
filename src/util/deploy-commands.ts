import allCommands from '../commands/allcommands'
import { REST } from '@discordjs/rest'
import { ApplicationCommandsAPI } from '@discordjs/core'
import { ENV } from './env'
import db from '../db/client'
import logger from './logger'
const { clientId, guildId, token } = ENV

const commands = allCommands.map((command) => command.data.toJSON())

const rest = new REST().setToken(token)
const api = new ApplicationCommandsAPI(rest)

;(async () => {
  logger.info('Deploying' + JSON.stringify(commands.map((c) => c.name)))
  try {
    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`
    )

    const data = await api.bulkOverwriteGlobalCommands(clientId, commands)

    logger.info(
      `Successfully reloaded ${JSON.stringify(
        data.map((command) => command.name)
      )} application (/) commands.`
    )
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
  db.connection.close()
})()
