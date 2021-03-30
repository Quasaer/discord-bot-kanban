let dbCmd  = require('../dbCommands.js');
const p = "%" //temporary

function boardConfigs(message, name){
	message.reply(`These are the default settings for ${name}\n`
				+ 'Columns: (`Backlog`, `Active`, `Done`)\n'
				+ 'Optional tart date is `null`\n'
				+ 'Optional Deadline date is `null`\n'
				+ 'Would you like to change these settings?\n'
				+ '`yes` to change settings or `no` to create board with default settings.\n'
				+ 'You have 30 seconds or else baord will not be made.\n');

		// First argument is a filter function - which is made of conditions
		// m is a 'Message' object
		message.channel.awaitMessages(m => m.author.id == message.author.id,
		{max: 1, time: 30000}).then(collected => {
			// only accept messages by the user who sent the command
			// accept only 1 message, and return the promise after 30000ms = 30s

			// first (and, in this case, only) message of the collection
			if (collected.first().content.toLowerCase() === 'yes') {
					message.reply('add deadline date (yyyy/mm/dd)');
						//column change function not handleStartDate -- to do later
					handleStartDate(message, name)
			} else if(collected.first().content.toLowerCase() === 'no') {
				dbCmd.findBoardByName(name).then((val) =>{
					if(val !== null){
						message.channel.send(`${name} already exists in the DB`);
					} else {
						const resp  = dbCmd.addBoard(name);
						if(resp){
							message.channel.send(`${name} has successfully been added to DB`);
						} else {
							console.log('error saving board to database')
						}
					}
				});
				return message.reply('Board has been created');
			} else {
				message.reply('That is not a valid response\n'
				+ 'Please retype addboard command');
			}     
		}).catch(() => {
					message.reply('No answer after 30 seconds, operation canceled.');
		});
};

function handleStartDate(message, name){
	message.reply('Would you like to add a start date?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else baord will not be made.\n');

		// First argument is a filter function - which is made of conditions
		// m is a 'Message' object
		message.channel.awaitMessages(m => m.author.id == message.author.id,
		{max: 1, time: 30000}).then(collected => {
					// only accept messages by the user who sent the command
					// accept only 1 message, and return the promise after 30000ms = 30s

					// first (and, in this case, only) message of the collection
					if (collected.first().content.toLowerCase() === 'yes') {
							message.reply('add deadline date (yyyy/mm/dd)');
							//add day

							// handleDeadlineDate(message, name)
					} else if(collected.first().content.toLowerCase() === 'no') {
							message.reply('Board has been created');
							//addboard
							// handleDeadlineDate(message, name)
					} else {
						message.reply('That is not a valid response\n'
						+ 'Please retype addboard command');
				}     
		}).catch(() => {
					message.reply('No answer after 30 seconds, operation canceled.');
		});
};

function handleDeadlineDate(message, name){
	message.reply('Would you like to add a deadline?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else baord will not be made.\n');

		// First argument is a filter function - which is made of conditions
		// m is a 'Message' object
		message.channel.awaitMessages(m => m.author.id == message.author.id,
		{max: 1, time: 30000}).then(collected => {
					// only accept messages by the user who sent the command
					// accept only 1 message, and return the promise after 30000ms = 30s

					// first (and, in this case, only) message of the collection
					if (collected.first().content.toLowerCase() === 'yes') {
							message.reply('add deadline date (yyyy/mm/dd)');
							//add day
					} else if(collected.first().content.toLowerCase() === 'no') {
							message.reply('Board has been created');
							//addboard
					} else {
						message.reply('That is not a valid response\n'
						+ 'Please retype addboard command');
						//addboard
				}     
		}).catch(() => {
					message.reply('No answer after 30 seconds, operation canceled.');
		});
}

module.exports = {
	name: 'addboard',
	description: 'addboard <name> <deadline>',
	execute(message, args) {
        let name = args[0];
		
		if (!name) {
			return message.reply('you need to name a board!\n'
			+ 'example: %addboard <board name>');
		} else {
			boardConfigs(message, name);
		}
    },
};