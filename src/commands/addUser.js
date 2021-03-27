let dbCmd  = require('../dbCommands.js');
module.exports = {
	name: 'adduser',
	description: 'add <variable> <name>',
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const find = dbCmd.findUser(target.tag);
		const user = target.tag.split('#');
		if(find){
			message.channel.send(`${user[0]} already exists in the DB`);
		} else{
			const resp  = dbCmd.addUser(target.tag);
			if(resp){
				message.channel.send(`${user[0]} has successfully been added to DB`);
			} else {
				console.log('error saving user to database')
			}
		}
	},
};