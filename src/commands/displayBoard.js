let dbCmd  = require('../dbCommands.js');
const Discord = require('discord.js');
 
module.exports = {
	name: 'displayboard',
	description: 'displayboard <board name>',
	execute(message, args) {
        let boardName = args[0];
        // find board by name
		dbCmd.findBoardByName(boardName).then((boardModel) =>{
            console.log(boardModel);
            let boardId = boardModel.board_id;
            // find all columns by board id
            dbCmd.findAllColumnNamesByBoardId(boardId).then((columnModel) =>{
                console.log(columnModel);
                var arrayColumnModel = columnModel;
                const boardEmbed = new Discord.MessageEmbed();
                // set attributes for message embed
                boardEmbed.setColor('#0099ff');
                boardEmbed.setTitle(boardModel.name);
                boardEmbed.setDescription('Columns and Tasks');
                boardEmbed.setThumbnail('https://i.dlpng.com/static/png/6905682_preview.png');
                // go through each column
                for(var x = 0; x < arrayColumnModel.length; x++){
                    // goes through all column records and its attributes
                    var columnObj = arrayColumnModel[x];
                    // set js object of values for embed addfields
                    var boardColumns = { name: '', value:[], inline: true };
                    // assign column name to fields values
                    boardColumns.name  = columnObj.name;
                    //boardColumns.value.push(x);
                    // use column_id from column record to find track record with the corresponding column_id
                    dbCmd.findColumnTrackIdByColumnId(columnObj.column_id).then((columnTrackModel) =>{
                        console.log(columnTrackModel);
                        var arrayColumnTrackModel = columnTrackModel;
                        // go through each track record to get the id
                        for(var i = 0; i < arrayColumnTrackModel.length; i++){
                            var columnTrackObj = arrayColumnTrackModel[i];
                            var columnTrackId = columnTrackObj.column_track_id;
                            // pass the ids to task table to find corresponding tasks that have the same column_track_id
                            dbCmd.findTasksByColumnTrackId(columnTrackId).then((taskModel) =>{
                                var arrayTaskModel = taskModel;
                                console.log(taskModel);
                                // go through all potential tasks, add values to boardColumns object
                                for(var y = 0; y < arrayTaskModel.length; y++){
                                    //var taskObj = arrayTaskModel[y];
                                    //boardColumns.value.push('Task');
                                }
                            });
                        }
                    });
                    // at the end of each iteration of the arrayColumnModel, values for the column name and column's tasks are added to the message embed
                    boardEmbed.addFields(boardColumns);
                }
                boardEmbed.setTimestamp();
                boardEmbed.setFooter('Kanban Discord Bot');
                message.channel.send(boardEmbed);
            });
		});
	},
};
