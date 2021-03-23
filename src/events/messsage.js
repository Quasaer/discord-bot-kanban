module.exports = {
	name: 'message',
	execute(oldMessage, newMessage, client) {
		console.log(`${message.author.tag} in #${message.channel.name} sent: ${message.content}`);
	},
};