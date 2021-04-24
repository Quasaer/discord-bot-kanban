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
	// data.task.push(5);
    console.log(data.updateColumnOrderNumber.length);

    // if(data.taskAssignmentCount !== 0){
	if(data.updateColumnOrderNumber.length !== 0){
		for(let i = 0; i < data.updateColumnOrderNumber.length; i++){
			dbCmd.updateColumn(data.updateColumnOrderNumber[i]);
		}
		deleteBoardAndColumn(message);
	} else {
		deleteBoardAndColumn(message);
	}	
}

function deleteBoardAndColumn(message){
	dbCmd.deleteTaskAssignment(data.taskAssignment).then(()=>{
		dbCmd.deleteTasks(data.task).then(()=>{
			dbCmd.deleteColumnTrack(data.columnTrack).then(()=>{
				dbCmd.deleteColumns(data.columns).then(()=>{
					message.reply('Your board has successfully been deleted.');
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
		updateColumnOrderNumber: [],
	};
}
module.exports = {
	name: 'deletecolumn',
	description: 'deletecolumn <board name> <column name>',
	count: 7,
	execute(message, args) {
        let boardNameInput = args[0];
        let columnNameInput = args[1];
		setData();
		
		if (!boardNameInput || !columnNameInput) {
			return message.reply('you need to name a board and column!\n'
			+ 'example: %editboard <board name> <column name>');
		} else {
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				if(boardModel !== null){
					dbCmd.findAllColumnNamesByBoardId(boardModel.board_id).then((columnModels) => {		
						let columnOrderNumberCheck = false;	
						let columnOrderNumberIndex = 0;		
						for (let i = 0; i < columnModels.length; i++) {
							if (columnModels[i].name == columnNameInput){
								columnOrderNumberCheck = true;
								columnOrderNumberIndex = i;
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
							}
							if(columnOrderNumberCheck == true && i > columnOrderNumberIndex){
								let columnOrderNumber = columnModels[i].column_order_number - 1;
								let updateColumnOrderNumberData = {
									updatedFields: {column_order_number: columnOrderNumber},
									updateCondition: {column_id: columnModels[i].column_id},
								};
								data.updateColumnOrderNumber.push(updateColumnOrderNumberData);
							}
						};
						// console.log(data.updateColumnOrderNumber);
						finalConfirmation(message);
					});
				} else {
					message.channel.send(`${nameInput} doesn't exist in the DB`);
				}
			});
		}
	},
};