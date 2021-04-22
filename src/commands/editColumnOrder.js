let dbCmd  = require('../dbCommands.js');
let data = {};
const embed = {
	color: 0x0099ff,
	title: '',
	description: 'Column names and order numbers.',
	thumbnail: {
		url: 'https://i.dlpng.com/static/png/6905682_preview.png',
	},
	fields: [],
};

function editColumnOrder(message){
    message.reply('re-order your columns:\n'
			+ '`example: 1, 3, 2, 4, ...`\n'
			+ 'Your columns:\n'
			+ 'You have 30 seconds or else task will not be made.\n');
            /*

            NEED TO CHECK IF THERE IS A BETTER WAY TO SHOW COLUMNS
            BACK TO USER

            */


    message.channel.awaitMessages(m => m.author.id == message.author.id,
    {max: 1, time: 30000}).then(collected => {
        let columnOrderList = collected.first().content.toLowerCase().split(/[ ,]+/);
		columnCountValidation = data.columnCount - 1;
		if(columnOrderList.length !== data.columnCount){
			message.reply(`You have not inputted enough columns order numbers, there should be ${data.columnCount} not ${columnOrderList.length}!`);
			editColumnOrder(message);
		// } else if(columnOrderList.length !== data.columnCount){
		// 	message.reply(`You have not inputted enough columns order numbers, there should be ${data.columnCount} not ${columnOrderList.length}!`);
		// 	editColumnOrder(message);

		} else {
			let ColumnOrderInputArray = [];
			for (let i = 0; i < columnOrderList.length; i++) {
				let number = parseInt(columnOrderList[i]);
				let numberValidation = Number.isInteger(columnOrderList);
				// if(Number.isInteger(123) === true){
				// 	console.log(numberValidation);
				// 	ColumnOrderInputArray.push(columnOrderList[i]);
				// } else{
				// 	message.reply('You can only input integers for the column order apart from `,');
				// 	editColumnOrder(message);
				// };
				/*
					check if inputs are all numbers
					check if they start from 1 to the column count
				*/
				console.log(numberValidation);
				console.log(number);
			}
			
			}
    }).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
    });
}


//final confirmation
function finalConfirmation(message){
	
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
	dbCmd.updateTask(data.task).then(() =>{
		message.reply(`changes have been successfully made to your task}`);
	});
}

//clear data
function setData() {
	data = {
		userid:'',
		board:{},
		columns:{},
        columnCount: 0,
	};
}

module.exports = {
	name: 'editcolumnorder',
	description: 'editcolumnorder <Board name>',
	execute(message, args) {
        let boardNameInput = args[0];
		setData();
		
		if (!boardNameInput ) {
			return message.reply('you need to name a board!\n'
			+ 'example: %edittask <Board name>');
		} else {
			const user = message.author.tag;
			dbCmd.findUser(user).then((userModel) =>{
				data.userid = userModel.user_id;
			});
			dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
				data.board['name']=boardModel.name;
				if(boardModel !== null){
                    dbCmd.findAllColumnNamesByBoardId(boardModel.board_id).then((columnModels) =>{
						if(columnModels.length !== 0){
							//
                            for (let i = 0; i < columnModels.length; i++) {
                                let count = data.columnCount;
                                data.columns[count] = {
                                    'id':columnModels[i].column_id,
                                    'name':columnModels[i].name,
                                    'column_order_number':columnModels[i].column_order_number,
                                };
                                data.columnCount ++;
                            };
							embed.title = data.board['name'];
							for (let i = 0; i < data.columnCount; i++) {

								let field = {};

								field['name'] = data.columns[i].name;
								field['value'] = `${data.columns[i].column_order_number}`;

								field['inline'] = true;
								embed['fields'].push(field);
							}

							message.channel.send({ embed: embed });
                            editColumnOrder(message)
                            //
						} else {
							message.channel.send(`The board ${boardNameInput} does not have any existing columns`);
						}
                    });

					// editboard(message);
				} else {
					message.channel.send(`The board ${boardNameInput} either doesn't exist in the DB or is case sensitive`);
				}
			});
			
		}
	},
};