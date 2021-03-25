module.exports = {
	name: 'message',
	execute(message, client) {
		const prefix = '%';
		if (!message.content.startsWith(prefix) || message.author.bot) return; // finds prefix, and trims it
		const args = message.content.slice(prefix.length).trim().split(/ +/); // regex for cutting space
		const command = args.shift().toLowerCase(); // turns all text to lowercase to avoid case issues
		if (!client.commands.has(command)) return; // finds if the command exists, if not do nothing
		if (message.channel.id != process.env.CHANNEL_ID) return;
		try {
			client.commands.get(command).execute(message, args); // try to execute it
		} catch (error) { // if not return error msg
			console.log(error); // console error
			message.reply('There was an error trying to execute that command'); // discord channel error
		}
	},
};