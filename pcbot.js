const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, Cannon_bot_text, seaweed_bot_text } = require('./config.json');
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const Transcriber = require("discord-speech-to-text");


// new client instance || Intents
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

// voice handling
const transcriber = new Transcriber("OBF2CDFSNBRM6TWKGGBMBAONXSEYQ3DG");
client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        const voiceChannel = interaction.options.getChannel('channel');
        if (interaction.commandName === 'join') {
            const voiceConnection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: false,
                selfMute: false,
            })
            //console.log(voiceConnection)
            voiceConnection.on(VoiceConnectionStatus.Ready, () => {
                console.log(`The connection has entered the Ready state - ready to listen!\n`);
            });
            voiceConnection.receiver.speaking.on("start", (userId) => {
                transcriber.listen(voiceConnection.receiver, userId, client.users.cache.get(userId)).then((data) => {
                  if (!data.transcript.text) return;
                  let text = data.transcript.text;
                  let user = data.user.username;
                  let tag = data.user.discriminator;
                  let confidence = data.transcript.speech.confidence
                  let rac = racism(text)
                  //console.log(`${user}#${tag} (${confidence}): ${text} | ${rac}`);
                  
                  //client.channels.cache.get(cannon_bot_text).send(`${user}#${tag} (${confidence}): ${text} | ${rac}`)
                  client.channels.cache.get(seaweed_bot_text).send(`${user}#${tag} (${confidence}): ${text} | ${rac}`)
                  //console.log(data);
                });
              });
        }
        if (interaction.commandName === 'disconnect') {
            const connection = getVoiceConnection(interaction.guildId);
            //console.log(connection)
            try { 
                connection.destroy();
            } catch (error) {
                console.log('error disconnecting')
            }
        }
    }
})

function racism(string) {
    var words = string.split(" ");
    var answer = "";
    var count = 0.0;
    var ratio = 0.0;
    for (var i = 0; i < words.length; i++) {
        if (words[i] === 'Nigger' || words[i] === 'nigger' || words[i] === 'Nigga')
        count++;
    }
    return count/words.length;
}

client.login(token);