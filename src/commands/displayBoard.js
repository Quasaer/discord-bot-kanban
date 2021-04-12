let dbCmd  = require('../dbCommands.js');
const Discord = require('discord.js');
 
module.exports = {
	name: 'displayboard',
	description: 'displayboard <board name>',
	execute(message, args) {
        let boardName = args[0];
        // find board by name
		dbCmd.findBoardByName(boardName).then((boardModel) =>{
            let boardId = boardModel.board_id;
            // find all columns by board id
            dbCmd.findAllColumnNamesByBoardId(boardId).then((columnModel) =>{
                var arrayBoardModel = columnModel;
                // using discord message embed to display message back to user,
                // call object, set attributes
                const boardEmbed = new Discord.MessageEmbed();
                boardEmbed.setColor('#0099ff');
                boardEmbed.setTitle(boardModel.name);
                boardEmbed.setDescription('Columns and Tasks');
                boardEmbed.setThumbnail('https://i.dlpng.com/static/png/6905682_preview.png');
                // loop through js object to get each column and its tasks
                for(var i = 0; i < arrayBoardModel.length; i++) {
                    var obj = arrayBoardModel[i];
                    boardEmbed.addFields(
                        { name: obj.name, value: 'Task(s)', inline: true },
                    );
                
                }
                boardEmbed.setTimestamp();
                boardEmbed.setFooter('Kanban Discord Bot');
                // send back to channel
                message.channel.send(boardEmbed);
            });
		});
	},
};