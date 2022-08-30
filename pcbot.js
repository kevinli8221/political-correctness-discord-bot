const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token, wit_key, Cannon_bot_text, seaweed_bot_text } = require('./config.json');
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice');
const Transcriber = require("discord-speech-to-text");
const Sequelize = require('sequelize');
//const {sequelize, Tags} = require('./pcdata.js');
//const {pcdata} = require('./pcdata.js');

const {
    word_data,
    b1,
    b1a,
    b2,
    b3,
    b4
} = require('./dataconfig.json')

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

// bot ready event
client.once('ready', () => {
    //Tags.sync();
    Tags.sync({ force: true }) // Debugging only!!!, clears tags on restart
	console.log(`Ready! Logged in as ${client.user.tag}`);
    //console.log(words)
});

// Sequelize database handling
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Tags = sequelize.define('tags', { 
    // test: { // user id
    //     type: Sequelize.STRING,
    //     unique: true,
    // },
    id: { // user id
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
    },
    b1_count: { 
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

// const Tags = sequelize.define('tags', {
// 	name: {
// 		type: Sequelize.STRING,
// 		unique: true,
// 	},
// 	description: Sequelize.TEXT,
// 	username: Sequelize.STRING,
// 	usage_count: {
// 		type: Sequelize.INTEGER,
// 		defaultValue: 0,
// 		allowNull: false,
// 	},
// });

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

var n_count = 0
// message logger
client.on('messageCreate', async (message) => {
    //console.log(`${message.author.tag}: ${message.content}`);
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
const transcriber = new Transcriber(wit_key);
client.on('interactionCreate', (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    //const { commandName } = interaction;

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

                let clean_text = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                clean_text = clean_text.toLowerCase()

                let rac = racism(clean_text)
                console.log(`${user}#${tag} (${confidence}) {racism: ${rac}}: ${clean_text}`);
                
                //client.channels.cache.get(cannon_bot_text).send(`${user}#${tag} (${confidence}): ${text} | ${rac}`)
                client.channels.cache.get(seaweed_bot_text).send(`${user}#${tag} (${confidence}) {racism: ${rac}}: ${clean_text}`)
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
})

// random function
function racism(string) {
    var words = string.split(" ");
    var count = 0.0
    for (var i = 0; i < words.length; i++) {
        if (words[i] === b1 || words[i] === b1a) {
        count++;
        }
    }
    return count/words.length;
}

async function update_tags(string) {

    // check if exists, if not create new Tag
    if ()
    
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	//const { commandName } = interaction;

	if (interaction.commandName === 'addtag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
	}
    // else if (interaction.commandName === 'tag') {
    //     const tagName = interaction.options.getString('test');
    
    //     const tag = await Tags.findOne({ where: { name: test } });
    
    //     if (tag) {
    //         //tag.increment('usage_count');
            
    //         console.log(tag);
    //         return interaction.reply(`{tag.get('description')}, ${tag.get('test')}, ${tag.get('id')}`);
    //     }
    
    //     return interaction.reply(`Could not find tag: ${tagName}`);
    // }
    if (interaction.commandName === 'showtags') {
        const tagList = await Tags.findAll({ attributes: ['name'] });
	    const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

	return interaction.reply(`List of tags: ${tagString}`);
}
    else if (interaction.commandName == 'taginfo') {
        const tagName = interaction.options.getString('name');

        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });

        if (tag) {
            return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
        }

        return interaction.reply(`Could not find tag: ${tagName}`);
    }
    else if (interaction.commandName === 'deletetag') {
        const tagName = interaction.options.getString('name');
        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });

        if (!rowCount) return interaction.reply('That tag doesn\'t exist.');

        return interaction.reply('Tag deleted.');
    }
});



client.login(token);