let dbCmd  = require('../dbCommands.js');

let data = {
	board:{
		id: '',
		name:'',
		deadlineDate:'',
		startDate:'',
		columns:[{
			1:{
				'name':'Backlog',
				'orderNumber':1
			},
			2:{
				'name':'Active',
				'orderNumber':2
			},
			3:{
				'name':'Done',
				'orderNumber':3
			}
		}],
	}
};

function boardConfigs(message, nameInput){
	
	message.reply(`These are the default settings for ${nameInput}\n`
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
			dbCmd.findBoardByName(nameInput).then((val) =>{
				if(val !== null){
					message.channel.send(`${nameInput} already exists in the DB`);
				} else {
					data.board.name = nameInput;
					handleStartDate(message);
				}
			});
			//column change function not handleStartDate -- to do later	
		} else if(collected.first().content.toLowerCase() === 'no') {	
			dbCmd.findBoardByName(nameInput).then((val) =>{
				if(val !== null){
					message.channel.send(`${nameInput} already exists in the DB`);
				} else {
					data.board.name = nameInput;
					populateDatabase(message);
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

function handleStartDate(message){
	message.reply('Would you like to add a start date?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else board will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {

		if (collected.first().content.toLowerCase() === 'yes') {
			handleStartDateInput(message);
		} else if(collected.first().content.toLowerCase() === 'no') {
			handleDeadlineDate(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function handleStartDateInput(message){ //gets input for start date
	message.reply('add Start date (YYYY-MM-DD)');
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		startDateInput = Date.parse(collected.first().content.toLowerCase());
		// console.log(startDateInput);
		if ( startDateInput !== 'NaN') {
			data.board.startDate = startDateInput;
			handleDeadlineDate(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function handleDeadlineDate(message){
	message.reply('Would you like to add a deadline date?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else board will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {

		if (collected.first().content.toLowerCase() === 'yes') {
			handleDeadlineDateInput(message);
		} else if(collected.first().content.toLowerCase() === 'no') {
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function handleDeadlineDateInput(message){ //gets input for deadline date
	message.reply('add Deadline date (YYYY-MM-DD)');
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const deadlineDateInput = Date.parse(collected.first().content.toLowerCase());
		// console.log(deadlineDateInput);
		if ( deadlineDateInput !== 'NaN') {
			data.board.deadlineDate = deadlineDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function finalConfirmation(message){

	message.reply(`Changes Successfully made\n`
			+ 'Would you like to continuw with these settings?\n'
			+ '`yes` to create board with default settings or `no` to cancel changes.\n'
			+ 'You have 30 seconds or else board will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			populateDatabase(message);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			boardConfigs(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
}


function populateDatabase(message){
	//go through data json object and make records
	const user = message.author.tag;
	// let columnName ='';
	// let columnOrderNumber ='';
	

	boardName = data.board.name; 
	startDate = data.board.startDate; 
	deadlineDate = data.board.deadlineDate; 

	

	dbCmd.findUser(user).then((userModel) =>{
		dbCmd.addBoard(userModel, boardName, startDate, deadlineDate).then((boardModel) => {
			// console.log(boardModel);
			message.channel.send(`${boardName} has successfully been added to DB`);
			if(boardModel !== null){
				
				// console.log(boardModel.board_id);
				data.board.id = boardModel.board_id;
				console.log(data);
	
				// db command get status => returning array of two model objects
				//column stuff
				/*
					for loop for columns
					inside for loop db add column (2 one for name and one for ).then()
					.then => for loop to loop through column status and add column track record 
	
				*/
				dbCmd.findAllColumnStatus().then((statusModels) => {
					for (let i = 1; i <= Object.keys(data.board.columns[0]).length; i++) {
						let columnName = data.board.columns[0][i].name;
						let columnOrderNumber = data.board.columns[0][i].orderNumber;
						dbCmd.addColumn(userModel, columnName, data.board.id, columnOrderNumber).then((columnModel) => {
							// console.log(columnModels);
							for (let j = 0; j<statusModels.length; j++){
								// console.log(statusModels[j].column_status_id);		
								dbCmd.addColumnTrackRecord(userModel, columnModel, statusModels[j]).then(() => {
									
									data = { //reset data array
										board:{
											id: '',
											name:'',
											deadlineDate:'',
											startDate:'',
											columns:[{
												1:{
													'name':'Backlog',
													'orderNumber':1
												},
												2:{
													'name':'Active',
													'orderNumber':2
												},
												3:{
													'name':'Done',
													'orderNumber':3
												}
											}],
										}
									};
									// console.log(data);
								});
							}
						});
					}
				});	
			} else {
				console.log('error saving board to database');
			}
		});
	});

	
}

module.exports = {
	name: 'addboard',
	description: 'addboard <name> <deadline>',
	execute(message, args) {
        let nameInput = args[0];
		
		if (!nameInput) {
			return message.reply('you need to name a board!\n'
			+ 'example: %addboard <board name>');
		} else {
			boardConfigs(message, nameInput);
		}
    },
};


/*
	instead of final confirmation
	could do a quesiton asking to edit any of the function and depending which one was chosen 
	will be the function called but will be the handle function adn not the input
*/