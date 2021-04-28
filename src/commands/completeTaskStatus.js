let dbCmd  = require('../dbCommands.js');
let data = {};

function updateTaskColumnTrackIdConfirmation(message){
    message.reply(`Would you like to update ${data.task["name"]} From active to Done?\n`
                + 'type `yes` to confirm or `no` to cancel.\n'
                + 'You have 30 seconds or else task will not be made.\n');

    message.channel.awaitMessages(m => m.author.id == message.author.id,
    {max: 1, time: 30000}).then(collected => {
        if (collected.first().content.toLowerCase() === 'yes') {
            updateTaskColumnTrackId(message);
        } else if(collected.first().content.toLowerCase() === 'no') {
            message.reply('Operation has been cancelled.');
        } else {
            message.reply('That is not a valid response\n' + 'Please re enter confirmation');
			updateTaskColumnTrackIdConfirmation(message);
        }     
    }).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
    });
}

function updateTaskColumnTrackId(message){
    dbCmd.updateTask(data.task).then(() =>{
		message.reply(`changes have been successfully made to your task`);
	});
}

function setData() {
	data = {
        task:{
            updatedFields:{},
            updateCondition:{}
        },		
	};
}


module.exports = {
	name: 'completetaskstatus',
	description: '`completetaskstatus <Board name> <Column name> <Task name>\nMark the specified task as done before moving on to the next column.`',
	execute(message, args) {
        let boardNameInput = args[0];
        let colummNameInput = args[1];
        let taskNameInput = args[2];
		setData();
		
		if (!boardNameInput || !colummNameInput || !taskNameInput) {
			return message.reply('you need to name a board, column name and task name!\n'
			+ 'example: %completetaskstatus <Board name> <Column name> <Task name>');
		} else {
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{
				data.task.updatedFields["updated_by_user_id"] = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
                    dbCmd.findColumnModelByBoardIdAndName(boardModel.board_id, colummNameInput).then((columnModel) =>{

						if(columnModel !== null){
							dbCmd.findTaskByColumnIdAndName(columnModel.column_id, taskNameInput).then((taskModel) =>{
								if(taskModel !== undefined){
                                    data.task.updateCondition["task_id"]=taskModel.task_id;
                                    data.task["name"]=taskModel.name;
                                    dbCmd.findMaxColumnTrackId(columnModel.column_id).then((MaxColumnTrackId) => {
                                        data.task.updatedFields["column_track_id"] = MaxColumnTrackId;
                                        updateTaskColumnTrackIdConfirmation(message);
                                    });
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
					message.channel.send(`The board ${boardNameInput} doesn't exist in the DB`);
				}
			});
			
		}
	},
};