let dbCmd = require("../dbCommands.js");
module.exports = {
	name: 'createuser',
	description: '`createuser <mention name>\nAdd a user to the database.`',
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		dbCmd.findUser(target.tag).then((val) =>{
			const user = target.tag.split('#');
			if (!message.mentions.users.size) {
				return message.reply('you need to tag a user in order to add them!');
			}
			if(val !== null){
				message.channel.send(`${user[0]} already exists in the DB`);
			} else {
				const resp  = dbCmd.createUser(target.tag);
				if(resp){
					message.channel.send(`${user[0]} has successfully been added to DB`);
				} else {
					console.log('error saving user to database')
				}
			}
		});
	},
};
