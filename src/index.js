const fs = require('fs');
//const { prefix, token } = require('./config.json');
const config = require('dotenv');
const Discord = require('discord.js');
require('dotenv').config();
const path = require('path');

// database
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();
const PREFIX = '!';
module.exports = { currency };
//

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

Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0; 
	},
});

client.login(process.env.LOGIN_TOKEN); //conencts to bot with token id