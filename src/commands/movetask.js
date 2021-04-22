let dbCmd  = require('../dbCommands.js');
let data = {};

function updateTaskColumnTrackIdConfirmation(message){
    message.reply(`Would you like to update ${data.task["name"]} to the next column?\n`
                + 'type `yes` to confirm or `no` to cancel.\n'
                + 'You have 30 seconds or else task will not be made.\n');

    message.channel.awaitMessages(m => m.author.id == message.author.id,
    {max: 1, time: 30000}).then(collected => {
        if (collected.first().content.toLowerCase() === 'yes') {
            updateTaskColumnTrackId(message);
        } else if(collected.first().content.toLowerCase() === 'no') {
            message.reply('Operation has been cancelled.');
        } else {
            message.reply('That is not a valid response\n'
            + 'Please retype edittask command');
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
	name: 'movetask',
	description: 'movetask <Board name> <Column name> <Task name>',
	execute(message, args) {
        let boardNameInput = args[0];
        let colummNameInput = args[1];
        let taskNameInput = args[2];
		setData();
		
		if (!boardNameInput || !colummNameInput || !taskNameInput) {
			return message.reply('you need to name a board, column name and task name!\n'
			+ 'example: %movetask <Board name> <Column name> <Task name>');
		} else {
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{
				data.task.updatedFields["updated_by_user_id"] = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
                    dbCmd.findColumnNameByBoardIdAndName(boardModel.board_id, colummNameInput).then((columnModel) =>{
						if(columnModel !== null){
							dbCmd.findTaskByColumnIdAndName(columnModel.column_id, taskNameInput).then((taskModel) =>{ //finding task
								if(taskModel !== undefined){
                                    data.task.updateCondition["task_id"]=taskModel.task_id; //assigning task id
                                    data.task["task_column_track_id"]=taskModel.column_track_id
                                    data.task["name"]=taskModel.name;
                                    /*
                                        code to move task to next column whilst staying in the right board
                                        find max of the column for a baord
                                        then add 1 to the column track if it is not above
                                    */
                                    dbCmd.findMaxColumnId(boardModel.board_id).then((MaxColumnId) => {; //finding the max column id for board
                                        dbCmd.findMaxColumnTrackId(MaxColumnId).then((MaxColumnTrackId) => {
                                            dbCmd.findColumnTrackByTaskTrackId(data.task["task_column_track_id"]).then((columnTrackModel)=>{
                                                data.task["column_status_id"]=columnTrackModel.column_status_id;
                                                if(data.task["task_column_track_id"] == MaxColumnTrackId){ //cehcks if column track is max
                                                    message.channel.send(`You have reached the end of your board`);
                                                } else if (data.task["column_status_id"] == 1) { //check if status is 1
                                                    message.channel.send(`Your task: ${data.task["name"]} has not been completed`);
                                                } else {
                                                    dbCmd.findColumnByColumnTrackColumnId(columnTrackModel.column_id).then((columnModel)=>{
                                                        let columnOrderNumber = columnModel.column_order_number;
                                                        columnOrderNumber++;
                                                        dbCmd.findColumnByBoardIdAndColumnOrderNumber(boardModel.board_id, columnOrderNumber).then((newColumnModel)=>{
                                                            dbCmd.findMinColumnTrackId(newColumnModel.column_id).then((newColumnTrackModel)=>{
                                                                data.task.updatedFields["column_track_id"] = newColumnTrackModel;
                                                            });
                                                        });
                                                    });
                                                    /* 
                                                        find column id using current column track for task
                                                        find current column
                                                        get current column order number
                                                        add 1 to order number
                                                        get min column track for new column
                                                        update task with that min column track id
                                                    */
                                                    /*
                                                    create findColumnByColumnTrackColumnId
                                                    let columnOrderNumbeer = column.order_number
                                                    columnOrderNumbeer ++;

                                                    */
                                                    // dbCmd.findMinColumnTrackId //get zappys
                                                    updateTaskColumnTrackIdConfirmation(message);
                                                }
                                            })
                                        });
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
					message.channel.send(`The baord ${boardNameInput} doesn't exist in the DB`);
				}
			});
			
		}
	},
};