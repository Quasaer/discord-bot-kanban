let dbCmd  = require('../dbCommands.js'); 
module.exports = {
	name: 'message',
	execute(message, client) {
		if (message.author.bot) return;
		const prefix = '%';
		const bind = 'bind';
		bindCommand = prefix.concat(bind);
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/);
		const command = args.shift().toLowerCase();
		const guildId = message.guild.id;
		const channelId = message.channel.id;
		const find = dbCmd.findConfigByServerId(guildId).then((configModel) =>{

		// if null, create config record, configmodel.create config
			if(configModel == null){
				dbCmd.createConfig(guildId);
				//launchCommand();
				if (!client.commands.has(command)) return;
				try {
					client.commands.get(command).execute(message, client);
				} catch (error) {
					console.log(error);
					message.reply('There was an error trying to execute that command');
				}
			} 
			else if(configModel.channel_bind_id == null){ // add only if the bind command has been sent //message.content == bindCommand
				//configModel.channel_bind_id == channelId
				//launchCommand();
				if (!client.commands.has(command)) return;
				try {
					client.commands.get(command).execute(message, client);
				} catch (error) {
					console.log(error);
					message.reply('There was an error trying to execute that command');
				}
			}
			else if(configModel.channel_bind_id != null){
				if(configModel.channel_bind_id == channelId || message.content == bindCommand){
					//launchCommand();
					if (!client.commands.has(command)) return;
					try {
						client.commands.get(command).execute(message, client);
					} catch (error) {
						console.log(error);
						message.reply('There was an error trying to execute that command');
					}
				} else{
					let channelName = message.channel.name;
					let redirectMsg = 'Channel is binded at: ';
					redirectMsg = redirectMsg.concat(channelName);
					message.reply(redirectMsg);
				}
			} else{
				// let channelName = message.channel.name;
				// let redirectMsg = 'Channel is binded at: ';
				// redirectMsg = redirectMsg.concat(channelName);
				message.reply("Error"); // change to state channel name 
			}
		});
		
		// function launchCommand(){
		// 	if (!client.commands.has(command)) return;
		// 		try {
		// 			client.commands.get(command).execute(message, client);
		// 		} catch (error) {
		// 			console.log(error);
		// 			message.reply('There was an error trying to execute that command');
		// 		}
		// }
	},
};
// function launchCommand(commandName, client){
// 	if (!client.commands.has(commandName)) return;
// 		try {
// 			client.commands.get(commandName).execute(message, client);
// 		} catch (error) {
// 			console.log(error);
// 			message.reply('There was an error trying to execute that command');
// 		}
// }