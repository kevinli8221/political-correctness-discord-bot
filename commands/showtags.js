const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showtags')
        .setDescription('shows all tags'),
    async execute(interaction) {
        //await interaction.reply(`displaying tags!`);
    },
}