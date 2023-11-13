import { SlashCommandStringOption } from 'discord.js'

export const realmOption = (required: boolean = false) => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('realm')
      .setDescription(
        'The realm of the character, without apostrophes and spaces, for example "lightnings-blade"'
      )
      .setMaxLength(25)
      .setRequired(required ?? true)
}

export const characterOption = (required: boolean = false) => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('character')
      .setDescription('The name of the character')
      .setMaxLength(12)
      .setRequired(required)
}

export const regionOptions = (required: boolean = false) => {
  return (option: SlashCommandStringOption) =>
    option
      .setName('region')
      .setDescription('The region of the character, defaults to EU')
      .setRequired(required)
      .addChoices(
        { name: 'US', value: 'us' },
        { name: 'Europe', value: 'eu' },
        { name: 'Korea', value: 'kr' },
        { name: 'Taiwan', value: 'tw' },
        { name: 'China', value: 'cn' }
      )
}
