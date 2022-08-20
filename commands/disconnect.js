const { SlashCommandBuilder } = require('discord.js');
const { ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('disconnects from a voice channel'),
    async execute(interaction) {
        await interaction.reply(`leaving channel...`);
    },
}