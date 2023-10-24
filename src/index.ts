import { Client, Events, GatewayIntentBits } from 'discord.js'
import commands from './commands/allcommands.ts'
import db from './db/client.ts'
import dotenv from 'dotenv'
import { ENV } from 'util/env.ts'
import { getAccessToken } from 'apis/auth.ts'
dotenv.config()

const TOKEN = process.env.DISCORD_TOKEN!

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

db.connection.on('error', console.error.bind(console, 'connection error:'))

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  console.log(
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

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// Log in to Discord with your client's token
client.login(TOKEN)

// const commands = [
//   {
//     name: 'ping',
//     description: 'Replies with Pong!',
//   },
// ]

// const rest = new REST({ version: '10' }).setToken(TOKEN)

// try {
//   console.log('Started refreshing application (/) commands.')

//   await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })

//   console.log('Successfully reloaded application (/) commands.')
// } catch (error) {
//   console.error(error)
// }
