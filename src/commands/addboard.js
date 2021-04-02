let dbCmd  = require('../dbCommands.js');
const p = "%" //temporary

function boardConfigs(message, name){
	
	const user = message.author.tag;

	message.reply(`These are the default settings for ${name}\n`
			+ 'Columns: (`Backlog`, `Active`, `Done`)\n'
			+ 'Optional start date is `null`\n'
			+ 'Optional Deadline date is `null`\n'
			+ 'Would you like to change these settings?\n'
			+ '`yes` to change settings or `no` to create board with default settings.\n'
			+ 'You have 30 seconds or else board will not be made.\n');

	// First argument is a filter function - which is made of conditions
	// m is a 'Message' object
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		// only accept messages by the user who sent the command
		// accept only 1 message, and return the promise after 30000ms = 30s

		// first (and, in this case, only) message of the collection
		if (collected.first().content.toLowerCase() === 'yes') {
			dbCmd.findBoardByName(name).then((val) =>{
				if(val !== null){
					message.channel.send(`${name} already exists in the DB`);
				} else {
					handleStartDate(message, name);
				}
			});
			//column change function not handleStartDate -- to do later	
		} else if(collected.first().content.toLowerCase() === 'no') {	
			dbCmd.findBoardByName(name).then((val) =>{
				if(val !== null){
					message.channel.send(`${name} already exists in the DB`);
				} else {
					dbCmd.findUser(user).then((userModel) =>{
						const resp = dbCmd.addBoard(userModel, name);
						// const boardModel = getBoardModel(name);
						// console.log(boardModel);
						dbCmd.findBoardByName(name).then((boardModel) =>{
							const columnResp = dbCmd.addColumn(userModel, name, boardModel);
						});
						if(resp){
							message.channel.send(`${name} has successfully been added to DB`);
						} else {
							console.log('error saving board to database');
						}
					});
				}
			});
			
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
				+ 'You have 30 seconds or else board will not be made.\n');

	// First argument is a filter function - which is made of conditions
	// m is a 'Message' object
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		// only accept messages by the user who sent the command
		// accept only 1 message, and return the promise after 30000ms = 30s

		// first (and, in this case, only) message of the collection
		if (collected.first().content.toLowerCase() === 'yes') {
			handleStartDateInput(message, name);
		} else if(collected.first().content.toLowerCase() === 'no') {
			const nullStartDate = '';
			handleDeadlineDate(message, name, nullStartDate);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function handleStartDateInput(message, name){ //gets input for start date
	message.reply('add Start date (YYYY-MM-DD)');

	// First argument is a filter function - which is made of conditions
	// m is a 'Message' object
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const startDate = Date.parse(collected.first().content.toLowerCase());
		console.log(startDate);
		if ( startDate !== 'NaN') {
			handleDeadlineDate(message, name, startDate);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function handleDeadlineDate(message, name, startDate){
	message.reply('Would you like to add a start date?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else board will not be made.\n');

	// First argument is a filter function - which is made of conditions
	// m is a 'Message' object
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		// only accept messages by the user who sent the command
		// accept only 1 message, and return the promise after 30000ms = 30s

		// first (and, in this case, only) message of the collection
		if (collected.first().content.toLowerCase() === 'yes') {
			handleDeadlineDateInput(message, name);
		} else if(collected.first().content.toLowerCase() === 'no') {
			const nullDeadlineDate = '';
			finalConfirmation(message, name, startDate, nullDeadlineDate);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function handleDeadlineDateInput(message, name, startDate){ //gets input for deadline date
	message.reply('add Deadline date (YYYY-MM-DD)');

	// First argument is a filter function - which is made of conditions
	// m is a 'Message' object
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const deadlineDate = Date.parse(collected.first().content.toLowerCase());
		console.log(startDate);
		if ( deadlineDate !== 'NaN') {
			finalConfirmation(message, name, startDate, deadlineDate);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};


function finalConfirmation(message, name, startDate, deadlineDate){
	const user = message.author.tag;

	console.log(startDate);
	console.log(deadlineDate);
	message.reply(`Changes Successfully made\n`
			+ 'Would you like to continuw with these settings?\n'
			+ '`yes` to create board with default settings or `no` to cancel changes.\n'
			+ 'You have 30 seconds or else board will not be made.\n');

	// First argument is a filter function - which is made of conditions
	// m is a 'Message' object
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		// only accept messages by the user who sent the command
		// accept only 1 message, and return the promise after 30000ms = 30s

		// first (and, in this case, only) message of the collection
		if (collected.first().content.toLowerCase() === 'yes') {
			dbCmd.findUser(user).then((userModel) =>{
				const resp = dbCmd.addBoard(userModel, name, startDate, deadlineDate);
				if(resp){
					message.channel.send(`${name} has successfully been added to DB`);
				} else {
					console.log('error saving board to database');
				}
			});
			//column change function not handleStartDate -- to do later	
		} else if(collected.first().content.toLowerCase() === 'no') {	
			boardConfigs(message, name, startDate, deadlineDate);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
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


/*
	instead of final confirmation
	could do a quesiton asking to edit any of the function and depending which one was chosen 
	will be the function called but will be the handle function adn not the input
*/