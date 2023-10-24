import { SlashCommandStringOption } from 'discord.js'

export const realmOption = () => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('realm')
      .setDescription('The realm of the character, without apostrophes and spaces, for example "lightnings-blade"')
      .setMaxLength(25)
      .setRequired(true)
}

export const characterOption = () => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('character')
      .setDescription('The name of the character')
      .setMaxLength(12)
      .setRequired(true)
}
