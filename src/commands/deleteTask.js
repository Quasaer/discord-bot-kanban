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
			deleteDatabase(message);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			message.reply('Your changes have been cancelled.\n' 
						+ 'Your task has not been affected');
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please type `yes` or `no`.');
			finalConfirmation(message);
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

function deleteDatabase(message){
	dbCmd.deleteTaskAssignment(data.taskAssignment).then(()=>{
		dbCmd.deleteTasks(data.task).then(()=>{
			message.reply('Your task has successfully been deleted.');
		});
	});
}

function setData() {
	data = {
        task:[],
        taskAssignment:[],
	};
}
module.exports = {
	name: 'deletetask',
	description: '`%deletetask <board name> <column name> <task name>\nDelete a task from a column in a specified board.`',
	count: 7,
	execute(message, args) {
        let boardNameInput = args[0];
        let columnNameInput = args[1];
        let taskNameInput = args[2];
		setData();
		
		if (!boardNameInput || !columnNameInput || !taskNameInput) {
			return message.reply('you need to name a board, column and task!\n'
			+ 'example: %editboard <board name> <column name> <task name>');
		} else {
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
					let columnFoundCheck = false;	
					let taskFoundCheck = false;	
					dbCmd.findAllColumnNamesByBoardId(boardModel.board_id).then((columnModels) => {		
						for (let i = 0; i < columnModels.length; i++) {
							if (columnModels[i].name == columnNameInput){
								columnFoundCheck = true;
								dbCmd.findAllColumnTracksByColumnId(columnModels[i].column_id).then((columnTrackModels)=>{
									for (let j = 0; j < columnTrackModels.length; j++) {
										dbCmd.findAllTasksByColumnTrackId(columnTrackModels[j].column_track_id).then((taskModels)=>{
											if (taskModels.length !== 0){
												for (let m = 0; m < taskModels.length; m++) {
													if(taskModels[m].name == taskNameInput){
														taskFoundCheck = true;
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
											}
										});
									}
								});
							}
						};
						if(columnFoundCheck == false){
							message.channel.send(`The column ${columnNameInput} doesn't exist in ${boardNameInput} or the DB.\n`
												+ `Please check ${columnNameInput} and try again`);
						} else{
							if(taskFoundCheck == false){
								message.channel.send(`the task ${taskNameInput} either doesn't exist in ${columnNameInput} or the DB.\n`
												+ `Please check ${taskNameInput} and try again`);
							} else{
								finalConfirmation(message);
							}
						}
					});
				} else {
					message.channel.send(`${boardNameInput} doesn't exist in the DB`);
				}
			});
		}
	},
};