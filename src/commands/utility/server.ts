import { Command } from 'commands/commandTypes.ts';
import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

const server: Command = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		return await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members and was created on ${interaction.guild?.createdAt}.`);
	},
};

export default server;
