module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	},
};


// module.exports = {
//     name: 'interactionCreate' interaction => {

//         if (!interaction.isChatInputCommand()) return;

//         const command = client.commands.get(interaction.commandName);

//         if (!command) return;

//         try {
//             await command.execute(interaction);
//             console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`)
//         } catch (error) {
//             console.error(error);
//             await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
//         }
//     };
// }