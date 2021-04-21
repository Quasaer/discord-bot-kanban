let dbCmd  = require('../dbCommands.js');
let data = {};

function editTask(message){
    message.reply(`Here are your columns.\n`
                + 'type `name` to change the name of the task.\n'
                + 'type `description` to change the description of the task.\n'
                + 'type `deadline` to change the deadline date of the task.\n'
                + 'You have 30 seconds or else task will not be made.\n');

    // message.channel.awaitMessages(m => m.author.id == message.author.id,
    // {max: 1, time: 30000}).then(collected => {
    //     if (collected.first().content.toLowerCase() === 'name') {
    //         editName(message);
    //     } else if(collected.first().content.toLowerCase() === 'description') {
    //         editDescription(message);
    //     } else if(collected.first().content.toLowerCase() === 'deadline') {
    //         editDeadlineDate(message);
    //     } else {
    //         message.reply('That is not a valid response\n'
    //         + 'Please retype edittask command');
    //     }     
    // }).catch(() => {
	// 	message.reply('No answer after 30 seconds, operation canceled.');
    // });
}


//final confirmation
function finalConfirmation(message){
	message.channel.send('re-order your columns:\n'
			+ '`example: 1, 3, 2, 4, ...`\n'
			+ 'Your columns:\n'
			+ 'You have 30 seconds or else task will not be made.\n');
            for (let i = 0; i < data.columnCount; i++) {
                message.channel.send('`'+`name:${data.columns[i].name}`+'`,`'+` ordernumber:${data.columns[i].column_order_number}`+'`')
            }
            /*

            NEED TO CHECK IF THERE IS A BETTER WAY TO SHOW COLUMNS
            BACK TO USER

            */

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			updateDatabase(message);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			message.reply('Your changes have been cancelled.\n' 
						+ 'Your task has not been affected');
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype edittask command');
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

//update database
function updateDatabase(message){
	dbCmd.updateTask(data.task).then(() =>{
		message.reply(`changes have been successfully made to your task}`);
	});
}

//clear data
function setData() {
	data = {
		userid:'',
		columns:{},
        columnCount: 0,
	};
}

module.exports = {
	name: 'editcolumnorder',
	description: 'editcolumnorder <Board name>',
	execute(message, args) {
        let boardNameInput = args[0];
		setData();
		
		if (!boardNameInput ) {
			return message.reply('you need to name a board!\n'
			+ 'example: %edittask <Board name>');
		} else {
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{
				data.userid = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
                    dbCmd.findAllColumnNamesByBoardId(boardModel.board_id).then((columnModels) =>{
						if(columnModels.length !== 0){
							//
                            for (let i = 0; i < columnModels.length; i++) {
                                let count = data.columnCount;
                                data.columns[count] = {
                                    'id':columnModels[i].column_id,
                                    'name':columnModels[i].name,
                                    'column_order_number':columnModels[i].column_order_number,
                                };
                                data.columnCount ++;
                            };
                            finalConfirmation(message)
                            //
						} else {
							message.channel.send(`The board ${boardNameInput} does not have any existing columns`);
						}
                    });

					// editboard(message);
				} else {
					message.channel.send(`The board ${boardNameInput} either doesn't exist in the DB or is case sensitive`);
				}
			});
			
		}
	},
};