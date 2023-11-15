import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { MythicPlusProgress } from 'types/battlenet/MythicPlusProgress.ts'
import { CharacterMedia } from 'types/battlenet/CharacterMedia'
import { getCharacterMedia, getMythicPlusProgress } from 'apis/battlenet.ts'
import { getMain } from 'db/operations/characteroperations.ts'
import { realms } from './realmnames'
import logger from 'util/logger'

const weekly: Command = {
  data: new SlashCommandBuilder()
    .setName('myvault')
    .setDescription('Get your mains vault mythic+ runs, same as running /vault with no parameters'),
  execute: async (interaction) => {
    const user = await getMain(interaction.user.id)
    const realm = user?.realm.toLowerCase()!
    const character = user?.characterName
    logger.info({ commandName: interaction.commandName, realm, character })
    if (!realms[realm] || !character) {
      return await interaction.reply({
        content: `No main found for <@${interaction.user.id}>. Use /setmain to set your main`,
        ephemeral: false,
      })
    }

    const mytchicPlusProgress = await getMythicPlusProgress(realm, character)

    const media: CharacterMedia = await getCharacterMedia(realm, character)

    if (mytchicPlusProgress.code === 404) {
      return await interaction.reply({
        content: `Character ${character} on realm ${realm} not found`,
        ephemeral: true,
      })
    }

    if (!mytchicPlusProgress.current_period.best_runs) {
      return await interaction.reply({
        content: `No runs found for ${character} on realm ${realm}`,
        ephemeral: true,
      })
    }

    const embed = buildVaultEmbed(
      mytchicPlusProgress,
      character,
      media.assets[2].value
    )

    return await interaction.reply({
      embeds: [embed],
      ephemeral: true,
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
  const msg = '```' + topKeys.map(tk => tk.replace('Dawn of the Infinite: ', '')).join('\n') + '```'
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
