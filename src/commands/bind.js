let dbCmd  = require('../dbCommands.js');
module.exports = {
	name: 'bind',
	description: 'Bind!',
	execute(message, args) {
		const target = message.channel.id;
		const find = dbCmd.findBindID(target.tag).then((val) =>{
			console.log(find);
			if(val !== null){
				message.channel.send(`The channel is already binded!`);
			} else {
				const resp  = dbCmd.addBindID(target.tag);
				if(resp){
					message.channel.send(`Channel has successfully been binded!`);
				} else {
					console.log('error saving user to database')
				}
			}
		});
	},
};