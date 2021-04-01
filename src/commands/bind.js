let dbCmd  = require('../dbCommands.js'); 
module.exports = {
	name: 'bind',
	description: 'Bind!',
	execute(message, args) {
		const channelId = message.channel.id;
		const guildId = message.guild.id;
		const find = dbCmd.findConfigByServerId(guildId).then((val) =>{
			if(val !== null){
				const resp  = dbCmd.updateBindId(channelId, guildId); // updates if already set
				message.channel.send(`The channel bind has been updated!`);
			} else {
				console.log(`A config record has not be stored yet.`);
			}
		});
	},
};