let dbCmd  = require('../dbCommands.js');
//const Config = require('../models/Config.js');
// let data = {
// 	config:{
// 		id:'',
// 		prefix:'',
// 		serverId:'',
// 		channelBindId:''
// 	}
// };
let data = {
	config:{
		id:'',
		channelBindId:'',
		updatedFields:{
			prefix:''
		},
		conditionalFields:{
			server_id:''
		}

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
					data.config.updatedFields.prefix = newPrefix;
					data.config.conditionalFields.server_id = configModel.server_id;
                    const resp  = dbCmd.updateConfig(data.config);
					message.channel.send(`The prefix has been updated!`);
                }
			} else {
				console.log(`A config record has not be stored yet.`);
			}
            
		});
	},
};