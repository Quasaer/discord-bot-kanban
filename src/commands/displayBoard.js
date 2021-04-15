let dbCmd  = require('../dbCommands.js');
const Discord = require('discord.js');
module.exports = {
	name: 'displayboard',
	description: 'displayboard <board name>',
	execute(message, args) {
        let boardName = args[0];
        // find board by name
        // super join // order by column order number
		dbCmd.findBoardByName(boardName).then((boardModel) =>{
            let boardId = boardModel.board_id;
            // find all columns by board id
            dbCmd.findAllColumnNamesByBoardId(boardId).then((columnModel) =>{
                var arrayColumnModel = columnModel;
                const boardEmbed = new Discord.MessageEmbed();
                // set attributes for message embed
                boardEmbed.setColor('#0099ff');
                boardEmbed.setTitle(boardModel.name);
                boardEmbed.setDescription('Columns and Tasks');
                boardEmbed.setThumbnail('https://i.dlpng.com/static/png/6905682_preview.png');
                for(var x = 0; x < arrayColumnModel.length; x++){
                    var columnObj = arrayColumnModel[x];
                    dbCmd.findTasksByColumnIdAndName(columnObj.column_id,columnObj.name,boardEmbed).then((taskModel) =>{
                        var boardColumns = { name: '', value:'', inline: true };
                        boardColumns.name  = 'columnObj.name';
                        var taskValues = '';
                        // go through each task
                        for(var i = 0; i < taskModel.length; i++){
                            var taskObj = taskModel[i];
                            taskValues = 'Task Name\n';//taskValues.concat(taskObj.name);
                        }
                        boardColumns.value = taskValues;
                        boardEmbed.addField(boardColumns);
                    });
                }
                boardEmbed.setTimestamp();
                boardEmbed.setFooter('Kanban Discord Bot');
                message.channel.send(boardEmbed);
            });
		});
	},
};
