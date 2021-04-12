let dbCmd  = require('../dbCommands.js');
let data = {};

function editTask(message){
    message.reply(`What would you like to edit in ${data.task.name}?\n`
                + 'type `name` to change the name of the task.\n'
                + 'type `description` to change the description of the task.\n'
                + 'type `deadline` to change the deadline date of the task.\n'
                + 'You have 30 seconds or else task will not be made.\n');

    message.channel.awaitMessages(m => m.author.id == message.author.id,
    {max: 1, time: 30000}).then(collected => {
        if (collected.first().content.toLowerCase() === 'name') {
            editName(message);
        } else if(collected.first().content.toLowerCase() === 'description') {
            editDescription(message);
        } else if(collected.first().content.toLowerCase() === 'deadline') {
            editDeadlineDate(message);
        } else {
            message.reply('That is not a valid response\n'
            + 'Please retype edittask command');
        }     
    }).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
    });
}

// name
function editName(message){ //gets input for deadline date
	message.reply(`State new name for your task. Current is: ${data.task.name}`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const newNameInput = collected.first().content;
		if ( newNameInput !== '') {
			data.task.updatedFields["name"] = newNameInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype edittask command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//start date
function editDescription(message){ //gets input for deadline date
	message.reply(`State new description for your task. Current is: ${data.task.description}`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const newDescriptionInput = collected.first().content;
		if ( newDescriptionInput !== '') {
			data.task.updatedFields["description"] = newDescriptionInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype edittask command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//deadline date
function editDeadlineDate(message){ //gets input for deadline date
	const date = dbCmd.getFormattedDate(data.task.deadline_date_time_stamp);
	message.reply(`State new deadline date (YYYY-MM-DD). Current is ${date}.`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		const deadlineDateInput = Date.parse(collected.first().content.toLowerCase());
		if ( deadlineDateInput !== 'NaN') {
			data.task.updatedFields["deadline_date_time_stamp"] = deadlineDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype edittask command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//final confirmation
function finalConfirmation(message){
	message.reply(`Changes Successfully made\n`
			+ 'Would you like to continue with these settings?\n'
			+ '`yes` to update task with new settings or `no` to cancel changes.\n'
			+ 'You have 30 seconds or else task will not be made.\n');

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
function clearData() {
	data = {
		task:{
			updatedFields:{},
			updateCondition:{},
		},
	};
}

module.exports = {
	name: 'edittask',
	description: 'edittask <Board name> <Column name> <Task name>',
	execute(message, args) {
        let boardNameInput = args[0];
        let colummNameInput = args[1];
        let taskNameInput = args[2];
		clearData();
		
		if (!boardNameInput || !colummNameInput || !taskNameInput) {
			return message.reply('you need to name a board, column name and task name!\n'
			+ 'example: %edittask <Board name> <Column name> <Task name>');
		} else {
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{
				data.task.updatedFields["updated_by_user_id"] = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
                    dbCmd.findColumnNameByBoardIdAndName(boardModel.board_id, colummNameInput).then((columnModel) =>{

						if(columnModel !== null){
							dbCmd.findTaskUsingColumnIdAndName(columnModel.column_id, taskNameInput).then((taskModel) =>{
								console.log(taskModel);
								if(taskModel !== undefined){
									data.task["name"] = taskModel.name;
									data.task["description"] = taskModel.description;
									data.task["deadline_date_time_stamp"] = taskModel.deadline_date_time_stamp;
									data.task.updateCondition["task_id"] = taskModel.task_id;
									console.log(data.task);
									editTask(message);
								} else {
									message.channel.send(`The task ${taskNameInput} doesn't exist in the DB.`);
								}
							});
						} else {
							message.channel.send(`The column ${colummNameInput} either doesn't exist in the DB or is case sensitive`);
						}
                    });

					// editboard(message);
				} else {
					message.channel.send(`The baord ${boardNameInput} doesn't exist in the DB`);
				}
			});
			
		}
	},
};