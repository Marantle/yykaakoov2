import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { MythicPlusProgress } from 'types/battlenet/MythicPlusProgress.ts'
import { realms } from './realmnames'
import { CharacterMedia } from 'types/battlenet/CharacterMedia'
import { characterOption, realmOption } from '../options.ts'
import { getCharacterMedia, getMythicPlusProgress } from 'apis/battlenet.ts'


const weekly: Command = {
  data: new SlashCommandBuilder()
    .setName('vault')
    .setDescription('Get your vault mythic+ runs')
    .addStringOption(characterOption())
    .addStringOption(realmOption()),
  execute: async (interaction) => {
    const realm = interaction.options.getString('realm')!
    const character = interaction.options.getString('character')!
    if (!realms[realm]) {
      return await interaction.reply({
        content: `Realm ${realm} not found`,
      })
    }

    const mytchicPlusProgress = await getMythicPlusProgress(realm, character)

    const media: CharacterMedia = await getCharacterMedia(realm, character)

    console.log(mytchicPlusProgress)
    if (mytchicPlusProgress.code === 404) {
      return await interaction.reply({
        content: `Character ${character} on realm ${realm} not found`,
      })
    }
    if (!mytchicPlusProgress.current_period.best_runs) {
      return await interaction.reply({
        content: `No runs found for ${character} on realm ${realm}`,
      })
    }
    const exampleEmbed = buildVaultEmbed(
      mytchicPlusProgress,
      character,
      media.assets[2].value
    )

    return await interaction.reply({
      embeds: [exampleEmbed],
    })
  },
}

function buildVaultEmbed(
  mytchicPlusProgress: MythicPlusProgress,
  character: string,
  thumbnail: string
) {
  const topKeys = mytchicPlusProgress.current_period.best_runs
    .map((run) => ({
      level: run.keystone_level,
      dungeon: run.dungeon.name,
    }))
    .sort((a, b) => a.level - b.level)
    .reverse()
    .slice(0, 8)
    .map((key) => `${key.dungeon?.padEnd(25, ' ')} ${key.level}`)
  const msg = '```' + topKeys.join('\n') + '```'
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      'Weekly runs for ' +
        character.charAt(0).toUpperCase() +
        character.slice(1)
    )
    .setThumbnail(thumbnail)
    .addFields({ name: ' ', value: msg })
  return embed
}

export default weekly
