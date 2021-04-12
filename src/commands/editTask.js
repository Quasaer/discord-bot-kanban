let dbCmd  = require('../dbCommands.js');
let data = {};

function editboard(message){
    message.reply(`What would you like to edit in ${data.task.name}?\n`
                + 'type `name` to change the name of the board.\n'
                + 'type `startdate` to change the start date of the board.\n'
                + 'type `deadline` to change the deadline date of the board.\n'
                + 'You have 30 seconds or else board will not be made.\n');

    message.channel.awaitMessages(m => m.author.id == message.author.id,
    {max: 1, time: 30000}).then(collected => {
        if (collected.first().content.toLowerCase() === 'name') {
            editName(message);
        } else if(collected.first().content.toLowerCase() === 'startdate') {
            editStartDate(message);
        } else if(collected.first().content.toLowerCase() === 'deadline') {
            editDeadlineDate(message);
        } else {
            message.reply('That is not a valid response\n'
            + 'Please retype editboard command');
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
			+ 'Please retype editboard command');
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
		const startDateInput = Date.parse(collected.first().content.toLowerCase());
		if ( startDateInput !== 'NaN') {
			data.board.updatedFields["start_date_time_stamp"] = startDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype editboard command');
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
		const deadlineDateInput = Date.parse(collected.first().content.toLowerCase());
		if ( deadlineDateInput !== 'NaN') {
			data.board.updatedFields["end_date_time_stamp"] = deadlineDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype editboard command');
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
			+ 'You have 30 seconds or else board will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			updateDatabase(message);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			message.reply('Your changes have been cancelled.\n' 
						+ 'Your board has not been affected');
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype editboard command');
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

//update database
function updateDatabase(message){
	console.log(data.board);
	dbCmd.updateBoard(data.board).then(() =>{
		message.reply(`changes have been successfully made to your board}`);
	});
}

//clear data
function clearData() {
	data = {
		task:{}
	};
}

module.exports = {
	name: 'edittask',
	description: 'editcolumnname <Board name> <column name> <task>',
	count: 9,
	execute(message, args) {
        let boardNameInput = args[0];
        let colummNameInput = args[1];
        let taskNameInput = args[2];
		clearData();
		
		if (!boardNameInput || !colummNameInput || !taskNameInput) {
			return message.reply('you need to name a board!\n'
			+ 'example: %editboard <board name> <column name>');
		} else {
			/*
				check board exists, if it does we can populate the data array return board model
				data.baord.startdate = boardmodel.
				data.column.deadline= boardmodel.
				else
			*/
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{ 
				data.column.updatedFields["updated_by_user_id"] = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
                    dbCmd.findColumnNameByBoardIdAndName(boardModel.board_id, colummNameInput).then((ColumnModel) =>{

						if(ColumnModel !== null){
							// console.log(ColumnModel);
							data.column.name = ColumnModel.name;
							data.column.updateCondition["column_id"] = ColumnModel.column_id;
							editColumn(message);
						} else {
							message.channel.send(`${colummNameInput} either doesn't exist in the DB or is case sensitive`);
						}
                    });

					// editboard(message);
				} else {
					message.channel.send(`${boardNameInput} doesn't exist in the DB`);
				}
			});
			
		}
	},
};