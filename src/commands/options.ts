import { SlashCommandStringOption } from 'discord.js'

export const realmOption = (required?: boolean) => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('realm')
      .setDescription('The realm of the character, without apostrophes and spaces, for example "lightnings-blade"')
      .setMaxLength(25)
      .setRequired(required ?? true)
}

export const characterOption = (required?: boolean) => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('character')
      .setDescription('The name of the character')
      .setMaxLength(12)
      .setRequired(required ?? true)
}
