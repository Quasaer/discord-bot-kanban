const { prefix } = require('../config.json'); //destructure prefix from file

//['ping, 'test] //gets array or string depending on type of commands such as shortcuts
//'ping' -> ['ping']

module.exports = (client, aliases, callback) => { //exports fuynction where client is bot, aliases is main command, callback is function which will run
    if (typeof aliases === 'string') {
        aliases = [aliases];
    }

    client.on('message', msg => {
        const { content } = msg; //get content of message

        aliases.forEach((alias) => {
            const command = `${prefix}${alias}`;

            if (content.startsWith(`${command}` ) || content === command){ //checks if command starts with the content(command) with a space directly after or if the command is exactly the same
                console.log(`running the command ${command}`);
                callback(msg);
            }
        });
    });
    // client.on('message', msg => {
    //     if (msg.content === 'ping') {
    //     msg.reply('HAii!');
    //     }
    // });
};