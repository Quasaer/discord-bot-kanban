let dbCmd  = require('../dbCommands.js');
let data = {};

function editboard(message){
    message.reply(`What would you like to edit in ${data.board.name}?\n`
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
		const newNameInput = collected.first().content.toLowerCase();
		if ( newNameInput !== '') {
			data.board.name = newNameInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};
/* 
    edit boardname
*/

//start date
function editStartDate(message){ //gets input for deadline date
	const date = getFormattedDate(data.board.startDate);
	message.reply(`State new start date (YYYY-MM-DD). Current is ${date}`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const startDateInput = Date.parse(collected.first().content.toLowerCase());
		if ( startDateInput !== 'NaN') {
			data.board.startDate = startDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addboard command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//deadline date
function editDeadlineDate(message){ //gets input for deadline date
	const date = getFormattedDate(data.board.deadlineDate);
	message.reply(`State new deadline date (YYYY-MM-DD). Current is ${date}`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const deadlineDateInput = Date.parse(collected.first().content.toLowerCase());
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
			+ 'Please retype addboard command');
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

//update database
function updateDatabase(message){
	dbCmd.updateBoard(data.board).then((boardModel) =>{
		message.reply(`changes have been successfully made to ${boardModel.name}`);
	});
}

//clear data
function clearData() {
	data = {
		board:{
			id:'',
			columns:[{}],
            userId:'',
		}
	};
}

module.exports = {
	name: 'editcolumn',
	description: 'editcolumns <Board name> <column name>',
	execute(message, args) {
        let boardNameInput = args[0];
        // let ColummNameInput = args[1];
		clearData();
		
		if (!boardNameInput) {
			return message.reply('you need to name a board!\n'
			+ 'example: %editboard <board name>');
		} else {
			/*
				check board exists, if it does we can populate the data array return board model
				data.baord.startdate = boardmodel.
				data.board.deadline= boardmodel.
				else
			*/
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{ 
				data.board.userId = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
					data.board.id = boardModel.board_id;
					data.board.name = boardNameInput;

                    dbCmd.findColumnNameByBoardId(boardModel.board_id).then((ColumnModel) =>{
                        console.log(ColumnModel);
                    });

					// editboard(message);
					console.log(data.board);
				} else {
					message.channel.send(`${boardNameInput} doesn't exist in the DB`);
				}
			});
			
		}
	},
};