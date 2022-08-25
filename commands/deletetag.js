const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletetag')
        .setDescription('delete tag')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('tag to delete')
                .setRequired(true)
    ),
    async execute(interaction) {
        //await interaction.reply(`adding tag!`);
    },
}