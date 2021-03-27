let dbCmd  = require('../dbCommands.js');
module.exports = {
	name: 'adduser',
	description: 'add <variable> <name>',
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const user = target.tag.split('#');
		let a  = dbCmd.addUser(user[0]);
		console.log(a);
		message.channel.send(a);
	},
};