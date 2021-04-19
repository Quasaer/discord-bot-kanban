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
        dbCmd.findBoardByName(boardName).then((board) =>{
            if(board != null && board.name == boardName){
                let columnName = args[1];
                dbCmd.findColumnNameByBoardIdAndName(board.board_id,columnName).then((column) => {
                    let limitNumber = parseInt(args[2]);
                    if(Number.isInteger(limitNumber) == true && column.name == columnName){
                        data.updateCondition.name = columnName;
                        data.updatedFields.task_limit = limitNumber;
                        dbCmd.updateColumn(data);
                        message.channel.send(`The Task Limit has been updated!`);
                    } else{
                        message.channel.send(`Invaild data entry.`);
                    }
                });
            } else{
                message.channel.send(`Not board of that name found.`);
            }
        });
	},
};
