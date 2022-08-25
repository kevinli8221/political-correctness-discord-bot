const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtag')
        .setDescription('add tags')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('tag to add')
                .setRequired(true))
        .addStringOption((option) =>
            option
                .setName('description')
                .setDescription('description to add')
                .setRequired(true)
    ),
    async execute(interaction) {
        //await interaction.reply(`adding tag!`);
    },
}