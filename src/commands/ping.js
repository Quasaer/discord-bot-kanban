module.exports = { // makes code visible to node.js and discord.js, use this on all the commands otherwise it won't work
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};