const config = require('./config.json');
const command = require('./cmd/command.js')
const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    command(client, ['ping', 'test'], (message) => {
        message.channel.send('Pong!');
    });

    command(client, 'help', (message) => {
        message.channel.send(`
These are the supported commands for the KAnban Bot.
The default prefix for the Kanban Bot is %.

**%status <INPUT>** - Updates bot status 
**%ping** - Returns 'Pong!'
        `); //not indented since it'll indent on discord as well
    });

    const { prefix } = config;
    client.user.setPresence({
        activity: {
            name:  `${prefix}help for help` //using prefix as template literal for future use
        }
    });

    command(client, 'status', message => { //update status of bot
        const content = message.content.replace('%status ', ''); // "%print hello" => "hello"

        client.user.setPresence({
            activity: {
                name: content,
                type: 0
            },
        });
    });

    
});

client.login(config.token); 