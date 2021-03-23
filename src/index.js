const fs = require('fs');
//const { prefix, token } = require('./config.json');
const config = require('dotenv');
const Discord = require('discord.js');
require('dotenv').config();
const path = require('path');

const client = new Discord.Client();
client.commands = new Discord.Collection;

const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands')).filter(file=>file.endsWith('.js'));
const eventFiles = fs.readdirSync(path.resolve(__dirname, './events')).filter(file=>file.endsWith('.js'));


for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

client.login(process.env.LOGIN_TOKEN); 
