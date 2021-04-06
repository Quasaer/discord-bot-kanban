let dbCmd  = require('../dbCommands.js');
const Config = require('../models/Config.js');
let data = {
	config:{
		id:'',
		prefix:'',
		serverId:'',
		channelBindId:''
	}
}; 
module.exports = {
	name: 'bind',
	description: 'Bind!',
	execute(message, args) {
		const channelId = message.channel.id;
		const guildId = message.guild.id;
		const find = dbCmd.findConfigByServerId(guildId).then((configModel) =>{
			if(configModel !== null){
				data.config.id = configModel.config_id; 
				data.config.prefix = configModel.prefix;
				data.config.serverId = configModel.server_id;
				data.config.channelBindId = channelId;
				//console.log(data.config);
				const resp  = dbCmd.updateConfig(data.config); // updates if already set //dbCmd.updateBindId(channelId, guildId);
				message.channel.send(`The channel bind has been updated!`);
			} else {
				console.log(`A config record has not be stored yet.`);
			}
		});
	},
};