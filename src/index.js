require('dotenv').config();

const { Client } = require('discord.js');

const client = new Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('HAii!');
  }
});

client.on('message', msg => {
    if (msg.content === 'sting') {
      msg.reply('Hey');
    }
  });

client.login(process.env.LOGIN_TOKEN);