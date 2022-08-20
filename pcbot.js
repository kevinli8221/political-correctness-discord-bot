const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const Transcriber = require("discord-speech-to-text");


// new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ] 
});

// command handling
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// // event handling
// const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = require(filePath);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

// bot ready event
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
var n_count = 0
// message logger
client.on('messageCreate', async (message) => {
    console.log(`${message.author.tag}: ${message.content}`);
    if (message.content == "nigger") {
        n_count++
        console.log(`Nigger Counter${n_count}`)
    }
  });

// slash command event
client.on('interactionCreate', async interaction => {
    
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`)
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// join + disconnect slash command
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'join') {
            const voiceChannel = interaction.options.getChannel('channel');
            const voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            })
            //console.log(voiceConnection)
            voiceConnection.on(VoiceConnectionStatus.Ready, () => {
                console.log('The connection has entered the Ready state - ready to play audio!');
            });
        }
        if (interaction.commandName === 'disconnect') {
            const connection = getVoiceConnection(interaction.guildId);
            //console.log(connection)
            try { 
                connection.destroy();
            } catch (error) {
                console.log('error dissconnecting')
            }
        }
    }
})

// leave slash command
// client.on('interactionCreate', (interaction) => {
//     if (interaction.isChatInputCommand()) {
//         if (interaction.commandName === 'disconnect') {
            
//         }
//     }
// })


// speech to text handling
// const transcriber = new Transcriber(`OBF2CDFSNBRM6TWKGGBMBAONXSEYQ3DG`);
// let channel = interaction.member.guild.channels.cache.get(interaction.member.voice.channel.id);
// const connection = joinVoiceChannel({
//   channelId: channel.id,
//   guildId: channel.guild.id,
//   adapterCreator: channel.guild.voiceAdapterCreator,
//   selfDeaf: false,
//   selfMute: false
// });
// connection.receiver.speaking.on("start", (userId) => {
//   transcriber.listen(connection.receiver, userId, client.users.cache.get(userId)).then((data) => {
//     if (!data.transcript.text) return;
//     let text = data.transcript.text;
//     let user = data.user;
//   });
// });

client.login(token);