require('dotenv').config();
module.exports = { // makes code visible to node.js and discord.js, use this on all the commands otherwise it won't work
	name: 'bind',
	description: 'Bind!',
	execute(message, args) {
        if (process.env.CHANNEL_BIND === FALSE){
            process.env.CHANNEL_BIND_ID = message.channel.id;
            process.env.CHANNEL_BIND = TRUE;
            message.channel.send('Channel Binded!');
        }
        else if (process.env.CHANNEL_BIND === TRUE){
            message.channel.send('Channel Already Binded!');
        }
        else{
            message.channel.send('Can only bind to one specfic channel.');
        }
		
	},
};