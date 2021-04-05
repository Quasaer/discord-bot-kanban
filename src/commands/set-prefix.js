let dbCmd  = require('../dbCommands.js'); 
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
                    const resp  = dbCmd.updatePrefix(newPrefix, guildId); 
				    message.channel.send(`The prefix has been updated!`);
                }
			} else {
				console.log(`A config record has not be stored yet.`);
			}
            
		});
	},
};