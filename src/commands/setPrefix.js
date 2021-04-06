let dbCmd  = require('../dbCommands.js');
let data = {
	config:{
		id:'',
		prefix:'',
		serverId:'',
		channelBindId:''
	}
};  
module.exports = {
	name: 'setprefix',
	description: 'setprefix <prefix>',
	execute(message, args) {
		const guildId = message.guild.id;
		const find = dbCmd.findConfigByServerId(guildId).then((configModel) =>{
             var prefixLength = message.content.length;
             var prefix = configModel.prefix;
             var newPrefix = message.content[prefixLength-1];
			if(configModel !== null){
                if(newPrefix == prefix){
                    message.channel.send(`That prefix is already set!`);
                } else{
					data.config.id = configModel.config_id; 
					data.config.prefix = newPrefix;
					data.config.serverId = configModel.server_id;
					data.config.channelBindId = configModel.channel_bind_id;
                    const resp  = dbCmd.updateConfig(data.config); //updatePrefix(newPrefix, guildId);
				    message.channel.send(`The prefix has been updated!`);
                }
			} else {
				console.log(`A config record has not be stored yet.`);
			}
            
		});
	},
};