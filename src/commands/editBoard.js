let dbCmd  = require('../dbCommands.js');
let data = {};

function editboard(message){
    message.reply(`What would you like to edit in ${data.board.name}?\n`
                + 'type `name` to change the name of the board.\n'
                + 'type `startdate` to change the start date of the board.\n'
                + 'type `deadline` to change the deadline date of the board.\n'
				+ 'type `cancel` to abort changes\n'
                + 'You have 30 seconds or else board will not be changed.\n');

    message.channel.awaitMessages(m => m.author.id == message.author.id,
    {max: 1, time: 30000}).then(collected => {
        if (collected.first().content.toLowerCase() === 'name') {
            editName(message);
        } else if(collected.first().content.toLowerCase() === 'startdate') {
            editStartDate(message);
        } else if(collected.first().content.toLowerCase() === 'deadline') {
            editDeadlineDate(message);
        } else if (collected.first().content.toLowerCase() === 'cancel'){
            message.reply('The edit command has been cancelled\n');
        } else {
            message.reply('That is not a valid response\n' 
						+ 'Please enter one of the specified options');
			editboard(message);
        }     
    }).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
    });
}

// name
function editName(message){ //gets input for deadline date
	message.reply(`State new name for your board. Current is: ${data.board.name}`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const newNameInput = collected.first().content;
		if ( newNameInput !== '') {
			data.board.updatedFields["name"] = newNameInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n' 
						+ 'Please enter a name');
			editName(message);
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//start date
function editStartDate(message){ //gets input for deadline date
	const date = dbCmd.getFormattedDate(data.board.startDate);
	message.reply(`State new start date (YYYY-MM-DD). Current is ${date}.`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		let startDateInput = Date.parse(collected.first().content.toLowerCase());
		let formattedDate = dbCmd.getFormattedDate(startDateInput);
		if ( collected.first().content.toLowerCase() === formattedDate) {
			data.board.updatedFields["start_date_time_stamp"] = startDateInput;
			handleDeadlineDate(message);
		} else {
			message.reply('That is not a valid response, or is not a vlid date\n'
			+ 'Please check and retype date');
			handleStartDateInput(message);
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//deadline date
function editDeadlineDate(message){ //gets input for deadline date
	const date = dbCmd.getFormattedDate(data.board.deadlineDate);
	message.reply(`State new deadline date (YYYY-MM-DD). Current is ${date}.`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const deadlineDateInput = Date.parse(collected.first().content.toLowerCase()); //parses input into date
		let formattedDate = dbCmd.getFormattedDate(deadlineDateInput); //formats date from parsed date
		if ( collected.first().content.toLowerCase() === formattedDate) { //checks inputted string against formatted date
			data.board.updatedFields["end_date_time_stamp"] = deadlineDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response, or a valid date\n'
			+ 'Please check and retype date.');
			handleDeadlineDateInput(message);
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//final confirmation
function finalConfirmation(message){
	message.reply(`Changes Successfully made\n`
			+ 'Would you like to continue with these settings?\n'
			+ '`yes` to update board with new settings or `no` to cancel changes.\n'
			+ 'You have 30 seconds or else board will not be updated.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			updateDatabase(message);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			message.reply('Your changes have been cancelled.\n' 
						+ 'Your board has not been affected');
		} else {
			message.reply('That is not a valid response\n' 
						+ 'Please re enter confirmation');
			finalConfirmation(message);
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

//update database
function updateDatabase(message){
	dbCmd.updateBoard(data.board).then(() =>{
		message.reply(`changes have been successfully made to your board}`);
	});
}

//clear data
function setData() {
	data = {
		board:{
			name:'',
			deadlineDate:'',
			startDate:'',
			updatedFields:{}, 
			updateCondition:{}, //set of attributes for where clause (dynamic)
		}
	};
}

module.exports = {
	name: 'editboard',
	description: '`editboard <name>\nEdit a board'+"'"+'s name, start date and deadline date.`',
	count: 7,
	execute(message, args) {
        let nameInput = args[0];
		setData();
		
		if (!nameInput) {
			return message.reply('you need to name a board!\n'
			+ 'example: %editboard <board name>');
		} else {
			/*
				check board exists, if it does we can populate the data array return board model
				data.board.startdate = boardmodel.
				data.board.deadline= boardmodel.
				else
			*/
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{
				data.board.updatedFields["updated_by_user_id"] = userModel.user_id;
			});
			dbCmd.findBoardByName(nameInput).then((boardModel) =>{
				if(boardModel !== null){
					data.board.updateCondition["board_id"] = boardModel.board_id;
					data.board.name = nameInput;
					data.board.startDate = boardModel.start_date_time_stamp;
					data.board.deadlineDate = boardModel.end_date_time_stamp;
					editboard(message);
				} else {
					message.channel.send(`${nameInput} doesn't exist in the DB`);
				}
			});
		}
	},
};