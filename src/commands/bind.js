let dbCmd  = require('../dbCommands.js');
module.exports = {
	name: 'bind',
	description: 'Bind!',
	execute(message, args) {
		const channelId = message.channel.id;
		const guildId = message.guild.id;
		const find = dbCmd.findBindIdByServerId(guildId).then((val) =>{
			if(val !== null){
				const resp  = dbCmd.updateBindId(channelId, guildId); // updates if already set
				message.channel.send(`The channel bind has been updated!`);
			} else {
				const resp  = dbCmd.addBindId(channelId, guildId);
				if(resp){
					message.channel.send(`Channel has successfully been binded!`);
				} else {
					console.log('error saving user to database')
				}
			}
		});
	},
};