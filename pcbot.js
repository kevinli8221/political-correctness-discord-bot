const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// runs once when client is ready
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
});


client.login(token);