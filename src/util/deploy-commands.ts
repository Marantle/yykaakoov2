import allCommands from '../commands/allcommands'
import { REST } from '@discordjs/rest'
import { ApplicationCommandsAPI } from '@discordjs/core'
import { ENV } from './env'
import db from '../db/client'
const { clientId, guildId, token } = ENV

const commands = allCommands.map((command) => command.data.toJSON())

const rest = new REST().setToken(token)
const api = new ApplicationCommandsAPI(rest)

;(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    )

    const data = await api.bulkOverwriteGlobalCommands(
      clientId,
      commands
    )

    console.log(
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
