let dbCmd  = require('../dbCommands.js');
module.exports = {
	name: 'message',
	execute(message, client) {
		if (message.author.bot) return;
		const prefix = '%';
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const guildId = message.guild.id;
		const channelId = message.channel.id;
		const find = dbCmd.findBindIdByServerId(guildId).then((val) =>{
		//console.log(val.getDataValue('channel_bind_id'));
			if(val == null || val.getDataValue('channel_bind_id') == channelId){ // add only if the bind command has been sent
				if (!client.commands.has(command)) return;
				try {
					client.commands.get(command).execute(message, client);
				} catch (error) {
					console.log(error);
					message.reply('There was an error trying to execute that command');
				}
			} else{
				message.reply('Channel is binded elsewhere');
			}
		});
		
	},
};