const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('taginfo')
        .setDescription('fetch tag info')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('taginfo to fetch')
                .setRequired(true)
    ),
    async execute(interaction) {
        //await interaction.reply(`adding tag!`);
    },
}