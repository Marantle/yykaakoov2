import { Command } from 'commands/commandTypes.ts'
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { MythicPlusProgress } from 'types/battlenet/MythicPlusProgress.ts'
import { realms } from './realmnames'
import { CharacterMedia } from 'types/battlenet/CharacterMedia'
import { characterOption, realmOption, regionOptions } from '../options.ts'
import { getCharacterMedia, getMythicPlusProgress } from 'apis/battlenet.ts'
import { getMain } from 'db/operations/characteroperations.ts'

const weekly: Command = {
  data: new SlashCommandBuilder()
    .setName('vault')
    .setDescription(
      'Get your mains vault mythic+ runs, or give realm and character to get anyones'
    )
    .addStringOption(characterOption(false))
    .addStringOption(realmOption(false))
    .addStringOption(regionOptions(false)),
  execute: async (interaction) => {
    let realm = interaction.options.getString('realm')
    let character = interaction.options.getString('character')
    let region = interaction.options.getString('region') ?? 'eu'
    if (realm && !realms[realm.toLocaleLowerCase()]) {
      return await interaction.reply({
        content: `Given realm ${realm} not found`,
        ephemeral: true,
      })
    }

    if (!realm && !character) {
      const user = await getMain(interaction.user.id)
      realm = user?.realm ?? null
      character = user?.characterName ?? null
    }

    if (!realm || !character) {
      return await interaction.reply({
        content: `Supply both, character and its realm, or use /setmain to set your main`,
        ephemeral: true,
      })
    }

    const mytchicPlusProgress = await getMythicPlusProgress(realm, character, region)

    const media: CharacterMedia = await getCharacterMedia(realm, character, region)

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

    const vaultEmbed = buildVaultEmbed(
      mytchicPlusProgress,
      character,
      media.assets[2].value
    )

    return await interaction.reply({
      embeds: [vaultEmbed],
      ephemeral: !interaction.options.getString('realm') && !interaction.options.getString('character'),
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
