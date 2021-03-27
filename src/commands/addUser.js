let dbCmd  = require('../dbCommands.js');
module.exports = {
	name: 'adduser',
	description: 'add <variable> <name>',
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const resp  = dbCmd.addUser(target.tag);
		console.log(resp);
		if(resp){
			const user = target.tag.split('#');
			message.channel.send(`${user[0]} has successfully been added to DB`);
		} else {
			console.log('error saving user to database')
		}
	},
};