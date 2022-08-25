const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('fetch tag')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('tag to fetch')
                .setRequired(true)
    ),
    async execute(interaction) {
        //await interaction.reply(`adding tag!`);
    },
}