module.exports = { // makes code visible to node.js and discord.js, use this on all the commands otherwise it won't work
	name: 'bind',
	description: 'Bind!',
	execute(message, args) {
        if (message.channel.id === process.env.CHANNEL_ID){
            message.channel.send('Channel Binded!');
        } else{
            message.channel.send('Can only bind to one specfic channel.');
        }
		
	},
};