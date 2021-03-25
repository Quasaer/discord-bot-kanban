module.exports = {
	name: 'message',
	execute(message, client) {
		const prefix = '%';
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		if (!client.commands.has(command)) return;
		try {
			client.commands.get(command).execute(message, client);
		} catch (error) {
			console.log(error);
			message.reply('There was an error trying to execute that command');
		}
	},
};