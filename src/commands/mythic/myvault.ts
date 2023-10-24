import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { MythicPlusProgress } from 'types/battlenet/MythicPlusProgress.ts'
import { CharacterMedia } from 'types/battlenet/CharacterMedia'
import { getCharacterMedia, getMythicPlusProgress } from 'apis/battlenet.ts'
import { getMain } from 'db/operations/characteroperations.ts'

const weekly: Command = {
  data: new SlashCommandBuilder()
    .setName('myvault')
    .setDescription('Get your mains vault mythic+ runs'),
  execute: async (interaction) => {
      const user = await getMain(interaction.user.id)
    const realm = user?.realm
    const character = user?.characterName
    if (!realm || !character) {
      return await interaction.reply({
        content: `No main found for <@${interaction.user.id}>. Use /setmain to set your main`,
      })
    }

    const mytchicPlusProgress = await getMythicPlusProgress(realm, character)

    const media: CharacterMedia = await getCharacterMedia(realm, character)

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
    const embed = buildVaultEmbed(
      mytchicPlusProgress,
      character,
      media.assets[2].value
    )

    return await interaction.reply({
      embeds: [embed],
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