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
						+ 'Please re enter confirmation');
			finalConfirmation(message);
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

//update database
function updateDatabase(message){
	dbCmd.deleteTaskAssignment(data.taskAssignment).then(()=>{
		dbCmd.deleteTasks(data.task).then(()=>{
			dbCmd.deleteColumnTrack(data.columnTrack).then(()=>{
				dbCmd.deleteColumns(data.columns).then(()=>{
					dbCmd.deleteBoard(data.board).then(()=>{
						message.reply('Your board has successfully been deleted.');
					});
				});
			});
		});
	});
}

function setData() {
	data = {
		board:[],
        columns:[],
        columnTrack:[],
        task:[],
        taskAssignment:[],
	};
}
module.exports = {
	name: 'deleteboard',
	description: '`delete <name>\nDelete a board/project.`',
	count: 7,
	execute(message, args) {
        let nameInput = args[0];
		setData();
		
		if (!nameInput) {
			return message.reply('you need to name a board!\n'
			+ 'example: %editboard <board name>');
		} else {
			dbCmd.findBoardByName(nameInput).then((boardModel) =>{
				if(boardModel !== null){
					data.board.push(boardModel.board_id);
                        dbCmd.findAllColumnNamesByBoardId(boardModel.board_id).then((columnModels) => {					
                            for (let i = 0; i < columnModels.length; i++) {
                                data.columns.push(columnModels[i].column_id);
                                dbCmd.findAllColumnTracksByColumnId(columnModels[i].column_id).then((columnTrackModels)=>{
                                    for (let j = 0; j < columnTrackModels.length; j++) {
										data.columnTrack.push(columnTrackModels[j].column_track_id);
                                        dbCmd.findAllTasksByColumnTrackId(columnTrackModels[j].column_track_id).then((taskModels)=>{
											if (taskModels.length !== 0){
												for (let m = 0; m < taskModels.length; m++) {
													data.task.push(taskModels[m].task_id);
													dbCmd.findAllTaskAssignmentsByTaskId(taskModels[m].task_id).then((taskAssignmentsModels)=>{
														if (taskAssignmentsModels !== undefined || taskAssignmentsModels[0].length !== 0){
															for (let n = 0; n < taskAssignmentsModels.length; n++) {
																data.taskAssignment.push(taskAssignmentsModels[n].task_assignment_id);
															};
														}
													});
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