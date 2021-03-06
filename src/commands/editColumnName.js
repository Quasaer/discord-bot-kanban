let dbCmd = require("../dbCommands.js");
let data = {};
function editColumn(message) {
  message.reply(
    `Would you like to edit the name of ${data.column.name}?\n` +
      "type `Yes` to confirm or `No` cancel."
  );

  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        editName(message);
      } else if (collected.first().content.toLowerCase() === "no") {
        message.reply("Command has been cancelled");
      } else {
        message.reply('That is not a valid response\n' 
						+ 'Please re enter confirmation');
			editColumn(message);
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

// name
function editName(message) {
  //gets input for deadline date
  message.reply(
    `State the new name for your column. Current is: ${data.column.name}`
  );
  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      const newNameInput = collected.first().content;
      if (newNameInput !== "") {
        dbCmd.findColumnModelByBoardIdAndName(data.board["board_id"], newNameInput).then((columnModel)=>{
          if(columnModel !== null){
            message.reply('That is name already exists in the database\n' 
						+ 'Please enter a new name for your column');
            editColumn(message);
          } else {
            data.column.updatedFields["name"] = newNameInput;
            finalConfirmation(message);
          }
        });
      } else {
        message.reply('That is not a valid response\n' 
						+ 'Please enter a name');
        editName(message);
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

//final confirmation
function finalConfirmation(message) {
  message.reply(
    `Changes Successfully made\n` +
      "Would you like to continue with these changes?\n" +
      "`yes` to update column with new name or `no` to cancel changes.\n" +
      "You have 30 seconds or else column name will not be changed.\n"
  );

  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        updateDatabase(message);
      } else if (collected.first().content.toLowerCase() === "no") {
        message.reply(
          "Your changes have been cancelled.\n" +
            "Your board has not been affected"
        );
      } else {
        message.reply('That is not a valid response\n' 
						+ 'Please re enter confirmation');
        finalConfirmation(message);
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

//update database
function updateDatabase(message) {
  dbCmd.updateColumn(data.column).then(() => {
    //capital ColumnModelsince they're models
    message.reply(`changes have been successfully made for the column`);
  });
}

//clear data
function clearData() {
  data = {
    board:{},
    column: {
      name: "",
      updatedFields: {},
      updateCondition: {}, //set of attributes for where clause (dynamic)
    },
  };
}

module.exports = {
  name: "editcolumnname",
  description: '`editcolumnname <Board name> <column name>\nEdit a specified column name of a board.`',
  count: 8,
  execute(message, args) {
    let boardNameInput = args[0];
    let colummNameInput = args[1];
    clearData();

    if (!boardNameInput || !colummNameInput) {
      return message.reply(
        "you need to name a board!\n" +
          "example: %editboard <board name> <column name>"
      );
    } else {
      /*
				check board exists, if it does we can populate the data array return board model
				data.board.startdate = boardmodel.
				data.column.deadline= boardmodel.
				else
			*/
      const user = message.author.tag;
      dbCmd.findUser(user).then((userModel) => {
        data.column.updatedFields["updated_by_user_id"] = userModel.user_id;
      });
      dbCmd.findBoardByName(boardNameInput).then((boardModel) => {
        if (boardModel !== null) {
          data.board["board_id"] = boardModel.board_id;
          dbCmd.findColumnModelByBoardIdAndName(boardModel.board_id, colummNameInput).then((ColumnModel) => {
            if (ColumnModel !== null) {
              data.column.name = ColumnModel.name;
              data.column.updateCondition["column_id"] = ColumnModel.column_id;
              editColumn(message);
            } else {
              message.channel.send(
                `${colummNameInput} either doesn't exist in the DB or is case sensitive`
              );
            }
          });

          // editboard(message);
        } else {
          message.channel.send(`${boardNameInput} doesn't exist in the DB`);
        }
      });
    }
  },
};
