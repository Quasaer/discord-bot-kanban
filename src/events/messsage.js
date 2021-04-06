let dbCmd  = require('../dbCommands.js'); 
module.exports = {
	name: 'message',
	execute(message, client) {
		if (message.author.bot) return;
		const guildId = message.guild.id;
		const channelId = message.channel.id;
		const find = dbCmd.findConfigByServerId(guildId).then((configModel) =>{
			const prefix = configModel.prefix;
			const bind = 'bind';
			// stores bind command, used to check if user typed it to update the channel bind (see line 27)
			bindCommand = prefix.concat(bind);
			if (!message.content.startsWith(prefix) || message.author.bot) return;
			const args = message.content.slice(prefix.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();
			// if null, create config record, configmodel.create config
			if(configModel == null){
				dbCmd.createConfig(guildId);
				launchCommand(message, client, command);
			} // no bind has been set
			else if(configModel.channel_bind_id == null){
				launchCommand(message, client, command); 
			}
			// bind has been set
			else if(configModel.channel_bind_id != null){
				// does the bind id in the config record equal the one in the message or does the content's message mention the bind command
				if(configModel.channel_bind_id == channelId || message.content == bindCommand){
					launchCommand(message, client, command);
				} else{ // if the channel id of the message doesnt equal the bind id in the config record, then don't allow the user to communicate with the bot
					let errorMsg = sendBindErrorMessage(message, configModel.channel_bind_id);
					message.reply(errorMsg);
				}
			} else{
				let errorMsg = sendBindErrorMessage(message, configModel.channel_bind_id);
				console.log(errorMsg);
			}
		});
		
	},
};
// call this to send bind error message, will tell user which channel is currently binded
 function sendBindErrorMessage(message, channelId){
	 let channelName = message.guild.channels.cache.get(channelId);
	 let redirectMsg = 'Channel is binded at: ';
	 redirectMsg = redirectMsg.concat(channelName);
	 
	 return redirectMsg;
 }

function launchCommand(message, client, commandName, args){
	if (!client.commands.has(commandName)) return;
		try {
			client.commands.get(commandName).execute(message, args);
		} catch (error) {
			console.log(error);
			message.reply('There was an error trying to execute that command');
		}
}