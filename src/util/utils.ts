import { EmbedBuilder } from 'discord.js'

export const c = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : 'error'

export function buildEmbedFromStringArray(ar: string[]) {
  const msg = '```' + ar.join('\n') + '```'
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(' ')
    .addFields({ name: ' ', value: msg })
  return embed
}
