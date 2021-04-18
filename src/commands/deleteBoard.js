let dbCmd  = require('../dbCommands.js');
let data = {};

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
    // console.log(data.taskAssignment[0]);

    if(data.taskAssignmentCount !== 0){
        for (let i = 0; i < data.taskAssignmentCount; i++) {
            dbCmd.deleteTaskAssignment(data.taskAssignment[i]);
        }
    }

    // dbCmd.deleteBoard(data.board["board_id"]).then(() =>{
	// 	message.reply(`changes have been successfully made to your task}`);
	// });
}

function setData() {
	data = {
		board:{},
        columns:{},
        columnTrack:{},
        task:{},
        taskAssignment:{},
        taskAssignmentCount:0,
	};
}
module.exports = {
	name: 'deleteboard',
	description: 'editboard <name>',
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
				data.baord.startdate = boardmodel.
				data.board.deadline= boardmodel.
				else
			*/
			// const user = message.author.tag;
			// dbCmd.findUser(user).then((userModel) =>{
			// 	data.board.updatedFields["updated_by_user_id"] = userModel.user_id;
			// });
			dbCmd.findBoardByName(nameInput).then((boardModel) =>{
				if(boardModel !== null){
					data.board["board_id"] = boardModel.board_id;
                        dbCmd.findAllColumnNamesByBoardId(data.board["board_id"]).then((columnModels) => {					
                            
                            for (let i = 0; i < columnModels.length; i++) {
                                // console.log(columnModels[i]);
                                // console.log(columnModels[i].column_id);
                                data.columns[i] = columnModels[i].column_id;
                                dbCmd.findAllColumnTracksByColumnId(columnModels[i].column_id).then((columnTrackModels)=>{
                                    for (let i = 0; i < columnTrackModels.length; i++) {
                                        data.columnTrack[i] = columnTrackModels[i].column_track_id;
                                        dbCmd.findAllTasksByColumnTrackId(columnTrackModels[i].column_track_id).then((taskModels)=>{
                                            for (let i = 0; i < taskModels.length; i++) {
                                                if (taskModels[i].length !== 0){
                                                    for (let i = 0; i < taskModels.length; i++) {
                                                        data.task[i] = taskModels[i].task_id;
                                                        dbCmd.findAllTaskAssignmentsByTaskId(taskModels[i].task_id).then((taskAssignmentsModels)=>{
                                                            if (taskAssignmentsModels !== undefined || taskAssignmentsModels[i].length !== 0){
                                                                for (let i = 0; i < taskAssignmentsModels.length; i++) {
                                                                    data.taskAssignment[i] = taskAssignmentsModels[i].task_assignment_id;
                                                                    data.taskAssignmentCount ++;
                                                                };
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                            };
                            finalConfirmation(message);
                        });
				} else {
					message.channel.send(`${nameInput} doesn't exist in the DB`);
				}
			});
		}
	},
};