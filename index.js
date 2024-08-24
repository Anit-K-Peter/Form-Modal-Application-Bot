const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.js');

// Create a new client instance
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ] 
});

// Create a collection to hold the commands
client.commands = new Collection();

// Read the command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load the commands into the collection and log them
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Command loaded: ${command.name}`);
}

// Log when the bot is ready
client.once('ready', () => {
    console.log(`Bot connected as ${client.user.tag}`);
});

// Listen for messages and handle commands
client.on('messageCreate', message => {
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

// Log in to Discord with your app's token
client.login(token);
