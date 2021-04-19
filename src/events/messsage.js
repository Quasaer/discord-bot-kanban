let dbCmd  = require('../dbCommands.js'); 
module.exports = {
	name: 'message',
	execute(message, client) {
		if (message.author.bot) return;
		const guildId = message.guild.id;
		const channelId = message.channel.id;
		dbCmd.findConfigByServerId(guildId).then((configModel) =>{
			if(configModel == null){
				dbCmd.createConfig(guildId);
				return;
			}
			if (!message.content.startsWith(configModel.prefix) || message.author.bot) return;
			const args = message.content.slice(configModel.prefix.length).trim().split(/ +/);
			const command = args.shift().toLowerCase();
			const bind = 'bind';
			bindCommand = configModel.prefix.concat(bind);
			let launchCommands = false;
			if(configModel.channel_bind_id == null){
				launchCommands = true;
			}
			if(configModel.channel_bind_id != null && configModel.channel_bind_id == channelId || message.content == bindCommand){
				launchCommands = true;
			} else{
				let errorMsg = sendBindErrorMessage(message, configModel.channel_bind_id);
				message.reply(errorMsg);
			}
			if(launchCommands === true){
				launchCommand(message, client, command, args);
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