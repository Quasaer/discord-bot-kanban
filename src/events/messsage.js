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
				launchCommand(message, client, command);
			} 
			else if(configModel.channel_bind_id == null){
				launchCommand(message, client, command);
			}
			else if(configModel.channel_bind_id != null){
				if(configModel.channel_bind_id == channelId || message.content == bindCommand){
					launchCommand(message, client, command);
				} else{
					//bindedId = Math.trunc(configModel.channel_bind_id);
					console.log(configModel.channel_bind_id); // config stored channel id
					console.log(channelId); // message channel id
					message.reply(sendErrorMessage(message, configModel.channel_bind_id ));
				}
			} else{
				message.reply(sendErrorMessage(message, configModel.channel_bind_id));
			}
		});
		
	},
};
 function sendErrorMessage(message, channelId){
	 let channelName = message.guild.channels.cache.get(channelId);//message.channel.name; // let channel = message.guild.channels.cache.get(channelid)
	 let redirectMsg = 'Channel is binded at: ';
	 redirectMsg = redirectMsg.concat(channelName);

	 //console.log(channelId);
	 
	 return redirectMsg;
 }

function launchCommand(message, client, commandName){
	if (!client.commands.has(commandName)) return;
		try {
			client.commands.get(commandName).execute(message, client);
		} catch (error) {
			console.log(error);
			message.reply('There was an error trying to execute that command');
		}
}