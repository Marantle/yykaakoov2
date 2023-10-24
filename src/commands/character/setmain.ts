import { SlashCommandBuilder } from 'discord.js'
import { Command } from '../commandTypes.ts'
import { characterOption, realmOption } from '../options.ts'
import { saveMain } from 'db/operations/characteroperations.ts'
import { realms } from 'commands/mythic/realmnames.ts'

const setMain: Command = {
  data: new SlashCommandBuilder()
    .setName('setmain')
    .setDescription('Save your main for use with other commands')
    .addStringOption(characterOption())
    .addStringOption(realmOption()),
  async execute(interaction) {
    const character = interaction.options.getString('character')!
    const realm = interaction.options.getString('realm')!

    const upserted = await saveMain(interaction.user.id, character, realm)
    
    console.log(interaction.user.id, character, realm)
    return await interaction.reply({ content: `<@${upserted?.discordUserId}>'s new main is ${c(upserted?.characterName)}-${realms[upserted!.realm]}`, ephemeral: true })
  },
}

const c = (s?: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "error"

export default setMain
