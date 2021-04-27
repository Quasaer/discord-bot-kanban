let dbCmd  = require('../dbCommands.js');
const embed = {
	color: 0x0099ff,
	title: '',
	url: 'https://discord.js.org',
	description: 'Columns and Tasks',
	thumbnail: {
		url: 'https://i.dlpng.com/static/png/6905682_preview.png',
	},
	fields: [],
};
module.exports = {
	name: 'displayboard',
	description: '`%displayboard <board name>\nDisplay a board/Project and all of the columns and tasks`',
	execute(message, args) {
        let boardName = args[0];
        embed.title = boardName;
		dbCmd.findBoardByName(boardName).then((board) =>{
            const data = dbCmd.findAllBoardColumnsByBoardId(board.board_id);
            data.then((result) => {
                let taskStringBuilder = [];
                let field = {}
                result[0].forEach((column, index)=> {
                    //Fetch all tasks by 
                    const tasks = dbCmd.findTasksByColumnTrackId(column.columnTrackId);
                    tasks.then((taskResult) =>{
                        if(index == 0 || index !=0 && result[0][index - 1].colName != column.colName ){
                            field = {};
                            field['name'] = column.colName;
                            taskStringBuilder = []
                        }
                        if(taskResult[0].length > 0){
                            taskResult[0].forEach(task => {
                                taskStringBuilder.push(`${task.taskName} - Status:  ${task.colStatus}  \n `)
                            });
                        }
                        if(index !=0 && result[0][index - 1].colName == column.colName ){
                            //check that the string builder is not empty
                            if(taskStringBuilder.length != 0){
                                field['value'] = taskStringBuilder.join("");
                            }else{
                                field['value'] = 'No Tasks';
                            }
                            field['inline'] = true;
                            embed['fields'].push(field);
                        }
                    }).finally(() => {
                        //Only send embed message when the field (column) count matches the number of columns taken from db
                        //Divide the result by 2 because of duplicates
                        if(embed.fields.length == result[0].length / 2){
                            message.channel.send({ embed: embed });
                        }
                    });
                });
            }).catch(err => {
                console.log(err);
            });
        }).catch(() =>{
            return message.channel.send(`Invalid board name.`);
        });
	},
};
