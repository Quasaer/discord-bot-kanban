let dbCmd  = require('../dbCommands.js');
let data = {
	updatedFields:{
		task_limit:''
	},
	updateCondition:{
        column_id:''
	}
};  
module.exports = {
	name: 'settasklimit',
	description: '`%settasklimit <board name> <column name> <number>\nSet a limit of tasks allowed for a specified column of a board.`',
	execute(message, args) {
        let boardName = args[0];
        // get user input to find board record
        dbCmd.findBoardByName(boardName).then((board) =>{
            // if the user input matches a board record
            if(board != null && board.name == boardName){
                let columnName = args[1];
                // find the column name by the board id from the board record and find the column name by what the user has inputted
                dbCmd.findColumnNameByBoardIdAndName(board.board_id,columnName).then((column) => {
                    if(column != null){
                        // set data object attributes
                        data.updateCondition.column_id = column.column_id;
                        data.updatedFields.task_limit = parseInt(args[2]);
                        // check if the limit number input is not a positive integer
                        if(Number.isInteger(data.updatedFields.task_limit) == false || data.updatedFields.task_limit < 0){
                            message.channel.send('Positive integers only to set task limit!'); return;
                        }
                        // find all the column track ids with the same column id, this finds the amount of tasks in a column
                        dbCmd.findColumnTrackIdByColumnId(column.column_id).then((columnTrack) => {
                            dbCmd.findTaskCountByColumnTrackId(columnTrack).then(result => {
                                var numTasks = result.taskCount;
                                // this makes sure that the number of tasks is < task limit the user has entered
                                if(numTasks > data.updatedFields.task_limit){
                                    message.channel.send('The number of current tasks cannot be higher than the task limit!')
                                }
                                else{
                                    // update column's task limit number
                                    dbCmd.updateColumn(data);
                                    message.channel.send(`The task limit has been updated!`);
                                }
                            });
                        });
                        // else, the column you are looking for doesn't exist.
                    } else{
                        message.channel.send('No column of that name found!');
                    }
                });
                // else, the board you are looking for doesn't exist.
            } else{
                message.channel.send(`No board of that name found!`);
            }
        });
	},
};
