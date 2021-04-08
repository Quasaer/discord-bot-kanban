let dbCmd  = require('../dbCommands.js');
let data = {};
/*
data comment
*/


function boardConfigs(message){
	message.reply(`These are the default settings for ${data.board.name}\n`
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

			handleColumnConfiguration(message);
			//column change function not handleStartDate -- to do later	
		} else if(collected.first().content.toLowerCase() === 'no') {	
			populateDatabase(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype createboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//config
function handleColumnConfiguration(message){
	message.reply('Would you like to create your own column(s)?\n'
				+ 'This will delete the current existing columns\n' 
				+ 'and you will need to create your own.\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else board will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {

		if (collected.first().content.toLowerCase() === 'yes') {
			data.columns = {};
			handleColumnConfigurationInput(message);
		} else if(collected.first().content.toLowerCase() === 'no') {
			handleStartDate(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype createboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
}
/*
	yes -> remove pre set objects for column names -> set up a an intger starting at 1 -> add column name, if want to add more -> add 1 to integer -> do function again
	init column object function
	column name input function
	conitnue Y/N function
*/
//

//function to empty list and start integer
function handleColumnConfigurationInput(message){ //gets input for start date
	message.reply('name a column');
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		let count = data.columnStartCount;
		columnNameInput = collected.first().content.toLowerCase();
		data.columns[count] = {
			'name':columnNameInput,
			'column_order_number':count,
		};
		handleColumnConfigurationConfirmation(message);
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//
function handleColumnConfigurationConfirmation(message){
	message.reply('Would you like to add another Column?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else board will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {

		if (collected.first().content.toLowerCase() === 'yes') {
			data.columnStartCount += 1;
			handleColumnConfigurationInput(message);
		} else if(collected.first().content.toLowerCase() === 'no') {
			handleStartDate(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype createboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
} 

//start date
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
			+ 'Please retype createboard command');
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
		if ( startDateInput !== 'NaN') {
			data.board["start_date_time_stamp"] = startDateInput;
			handleDeadlineDate(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype createboard command');
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
			+ 'Please retype createboard command');
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
		if ( deadlineDateInput !== 'NaN') {
			data.board["end_date_time_stamp"] = deadlineDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype createboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

function finalConfirmation(message){

	message.reply(`Changes Successfully made\n`
			+ 'Would you like to continue with these settings?\n'
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
			+ 'Please retype createboard command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
}


function populateDatabase(message){
	const user = message.author.tag;
	
	dbCmd.findUser(user).then((userModel) =>{
		data.board["created_by_user_id"] = userModel.user_id;
		data.columnTrack["created_by_user_id"] = userModel.user_id;
		// console.log(data.board);
		dbCmd.createBoard(data.board).then((boardModel) => {
			// console.log(boardModel);
			if(boardModel !== null){
				message.channel.send(`${data.board["name"]} has successfully been added to DB`);
	
				// db command get status => returning array of two model objects
				//column stuff
				/*
					for loop for columns
					inside for loop db add column (2 one for name and one for ).then()
					.then => for loop to loop through column status and add column track record 
	
				*/
				dbCmd.findAllColumnStatus().then((statusModels) => {
					//for loop to get statusmodel into data.columnStatus
					// for (let a = 0; a<statusModels.length; a++) {
					// 	// console.log(statusModels[a].column_status_id);
					// 	data.columnStatus["column_status_id"] = statusModels[a].column_status_id;
					// 	console.log(data.columnStatus);
					// };
					
					for (let i = 1; i <= Object.keys(data.columns).length; i++) {
						data.columns[i]["created_by_user_id"] = userModel.user_id;
						data.columns[i]["board_id"] = boardModel.board_id;
						// console.log(data.columns[i]);
						dbCmd.addColumn(data.columns[i]).then((columnModel) => {
							data.columnTrack["column_id"] = columnModel.column_id;
							// console.log(data.columnTrack);
							for (let j = 0; j<statusModels.length; j++){
								// data.columnTrack["column_status_id"] = data.columnStatus[j].column_status_id;
								// console.log(data.columnStatus[0]["column_status_id"]);
								data.columnTrack["column_status_id"] = statusModels[j].column_status_id;

								// console.log(data.columnStatus);
								// console.log("------------");
								// console.log(data.columnTrack);
								// console.log("");

								dbCmd.addColumnTrackRecord(data.columnTrack);
							}
						});
					};
				});	
			} else {
				message.channel.send(`Error Occured`);
				console.log('error saving board to database');
			}
		});
	});

	
}
function resetData(){
	data = {
		board:{},
		columnStartCount:1,
		columns:{
			1:{
				'name':'Backlog',
				'column_order_number':1
			},
			2:{
				'name':'Active',
				'column_order_number':2
			},
			3:{
				'name':'Done',
				'column_order_number':3
			}
		},
		columnTrack:{},
	};
}

module.exports = {
	name: 'createboard',
	description: 'createboard <name>',
	execute(message, args) {
        let nameInput = args[0];

		resetData()
		
		if (!nameInput) {
			return message.reply('you need to name a board!\n'
			+ 'example: %createboard <board name>');
		} else {
			data.board["name"] = nameInput;
			dbCmd.findBoardByName(data.board.name).then((boardModel) =>{
				if(boardModel !== null){
					message.channel.send(`${data.board.name} already exists in the DB`);
				} else {
					boardConfigs(message);
				}
			});
		}
    },
};


/*
	instead of final confirmation
	could do a quesiton asking to edit any of the function and depending which one was chosen 
	will be the function called but will be the handle function adn not the input
*/