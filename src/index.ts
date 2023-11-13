import { Client, Events, GatewayIntentBits } from 'discord.js'
import commands from './commands/allcommands.ts'
import db from './db/client.ts'
import dotenv from 'dotenv'
import { ENV } from 'util/env.ts'
import logger from 'util/logger.ts'
dotenv.config()

const { token } = ENV

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

db.connection.on('error', console.error.bind(console, 'connection error:'))

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  logger.info(
    `user ${interaction.user.displayName}(${interaction.user.globalName}) invoked ${interaction.commandName}`
  )
  const command = commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
})

client.once(Events.ClientReady, (c) => {
  logger.info(`Ready! Logged in as ${c.user.tag}`)
})

client.login(token)
