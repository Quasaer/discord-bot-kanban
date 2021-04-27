const dbCmd = require("../dbCommands.js");

let data = {};

//confirms the user wants to create a column
//boardNameInput - The name of the board to create a column in.
function confirmation(message, boardNameInput) {
  message.reply(
    `Would you like to add a column in ${boardNameInput}?\n` +
      "`yes` to create columns or `no` to cancel.\n" +
      "You have 30 seconds or else columns will not be added.\n"
  );

  //collects messages from the original message author
  message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1,time: 30000,}).then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
          columnConfiguration(message, boardNameInput);
      } else if (collected.first().content.toLowerCase() === "no") {
        message.channel.send("operation canceled");
      } else {
        message.reply('That is not a valid response\n' + 'Please re enter confirmation');
        confirmation(message, boardNameInput);
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

//configures the column and adds it to the data array
//boardNameInput - The name of the board to create a column in.
function columnConfiguration(message, boardNameInput) {
  message.reply("name a column");
  message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1,time: 30000,}).then((collected) => {
      columnNameInput = collected.first().content.toLowerCase();
      let boardColumnDuplicationCheck = false;
      let columnDuplicationCheck = false;
      dbCmd.findBoardByName(boardNameInput).then((val) => {
        
        dbCmd.countBoardColumns(val.board_id).then((columnCount) => {
          dbCmd.findAllColumnModelsByBoardId(val.board_id).then((columnModels) => {					
            for (let i = 0; i < columnModels.length; i++) {
              if(columnNameInput == columnModels[i]["name"]){
                boardColumnDuplicationCheck = true;
              }
            }
            for (let i = 0; i < Object.keys(data.columns).length; i++) {
              if(columnNameInput == data.columns[i]["name"]){
                columnDuplicationCheck = true;
              }
            }
            if(boardColumnDuplicationCheck == true || columnDuplicationCheck == true){
              message.reply(`${columnNameInput} has already been created,\n` +
                `you canot have duplicate columns`);
              columnConfirmation(message, boardNameInput);
            } else {
              addColumn(message, columnNameInput, columnCount, boardNameInput);
            }
          });
        });


      });
    })
    .catch((error) => {
      console.error(error);
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

function addColumn(message, columnNameInput, columnCount, boardNameInput){
  let order_number = columnCount + data.count + 1;
  data.columns[data.count] = {
    name: columnNameInput,
    column_order_number: order_number,
  };
  data.count++;
  columnConfirmation(message, boardNameInput);
}

//configures the column and adds it to the data array
//boardNameInput - The name of the board to create a column in.
function columnConfirmation(message, boardNameInput) {
  message.reply(`Would you like to name another Column for your board: ${boardNameInput}?\n` +
      "Confirm with `yes` or deny with `no`.\n" +
      "You have 30 seconds or else board will not be made.\n"
  );

  message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1, time: 30000,}).then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        columnConfiguration(message, boardNameInput);
      } else if (collected.first().content.toLowerCase() === "no") {
        finalConfirmation(message, boardNameInput);
      } else {
        message.reply('That is not a valid response\n' + 'Please re enter confirmation');
        columnConfirmation(message, boardNameInput);
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}


function finalConfirmation(message, boardNameInput){

	message.reply(`Column(s) successfully created.\n`
			+ 'Would you like to continue with these changes?\n'
			+ '`yes` to add the created columns(s) or `no` to cancel changes.\n'
			+ 'You have 30 seconds or else columns will not be added.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,
	{max: 1, time: 30000}).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			populateDatabase(message, boardNameInput);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			message.reply('Operation has been cancelled\n');
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please re enter confirmation');
			finalConfirmation(message, boardNameInput);
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}

//puts the column data into the database
//the name of the board to create a column in.
function populateDatabase(message, boardNameInput) {
  const user = message.author.tag;

  dbCmd.findUser(user).then((userModel) => {
    let userId =  userModel.user_id
    data.columnTrack["created_by_user_id"] = userId;
    dbCmd.findBoardByName(boardNameInput).then((boardModel) => {
      if (boardModel) {
        //loop through columns and add to db
        
        dbCmd.findAllColumnStatus().then((statusModels) => {
          for (let i = 0; i < Object.keys(data.columns).length; i++) {
            data.columns[i]["created_by_user_id"] = userId;
						data.columns[i]["board_id"] = boardModel.board_id;
            dbCmd.createColumn(data.columns[i]).then((columnModel) => {
              data.columnTrack["column_id"] = columnModel.column_id;
              for (let j = 0; j < statusModels.length; j++) {
                data.columnTrack["column_status_id"] = statusModels[j].column_status_id;
                dbCmd.createColumnTrackRecord(data.columnTrack);
              }
            });
          }
        }).catch((err) => {
          console.log(err);
        });
        message.channel.send(`Columns created in board ${boardNameInput}`);
      } else {
        message.channel.send(`Error Occured`);
      }
    });
  }); 
}

function resetData() {
  data = {
    columns:{},
    columnTrack: {},
    count: 0,
  };
}

module.exports = {
  name: "addcolumn",
  description: '`addcolumn <board name>\nAdd a column or columns to a specified board.`',
  count: 6,
  execute(message, args) {
    let boardNameInput = args[0];

    resetData();

    if (!boardNameInput) {
      return message.reply("you need to name a board!\n" + "example: %addcolumn <board name>");
    } else {
      dbCmd.findBoardByName(boardNameInput).then((val) => {
        if (!val) {
          message.channel.send(`${boardNameInput} doesn't exist in the db use \`%createboard\` to create it`);
        } else {
          confirmation(message, boardNameInput);
        }
      });
		}
  },
};


