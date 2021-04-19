let dbCmd  = require('../dbCommands.js');
let data = {
	updatedFields:{
		task_limit:''
	},
	updateCondition:{
        name:'' // column name
	}
};  
module.exports = {
	name: 'settasklimit',
	description: 'settasklimit <board name> <column name> <number>',
	execute(message, args) {
        let boardName = args[0];
        // get user input to find board record
        dbCmd.findBoardByName(boardName).then((board) =>{
            // if the user input matches a board record
            if(board != null && board.name == boardName){
                let columnName = args[1];
                // find the column name by the board id from the board record and find the column name by what the user has inputted
                dbCmd.findColumnNameByBoardIdAndName(board.board_id,columnName).then((column) => {
                    // parse str to int
                    let limitNumber = parseInt(args[2]);
                    // check if the number entered is an integer or not and if the column name inputted is found in the column record
                    if(Number.isInteger(limitNumber) == true && column.name == columnName){
                        data.updateCondition.name = columnName;
                        data.updatedFields.task_limit = limitNumber;
                        // set data object with values, then pass values to updateColumn record
                        dbCmd.updateColumn(data);
                        message.channel.send(`The Task Limit has been updated!`);
                    } else{
                        // if args[2] is not an integer and the column name entered doesn't exist
                        message.channel.send(`Invaild data entry.`);
                    }
                });
                // else, the board you are looking for doesn't exist.
            } else{
                message.channel.send(`Not board of that name found.`);
            }
        });
	},
};
