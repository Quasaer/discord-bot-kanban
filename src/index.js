const fs = require('fs'); 
const Discord = require('discord.js'); 
require('dotenv').config(); 
const path = require('path'); 
// index.js: gathers all commands as a collection and it also executes the events
// line1: directory module built into node.js
// line2: get discord.js
// line3: gets data from .env file
// line4: paths the relative paths


const client = new Discord.Client();
client.commands = new Discord.Collection; // compliation of export modules from the commands files
// reads the commands and events directory and scans through each file
const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file=>file.endsWith('.js'));
const eventFiles = fs.readdirSync(path.resolve(__dirname, './events')).filter(file=>file.endsWith('.js'));

// gets each file and puts it the collection
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
// gets each event and executes them
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
// login token for the bot
client.login(process.env.LOGIN_TOKEN); 
