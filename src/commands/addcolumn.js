const dbCmd = require("../dbCommands.js");

let data = {};
let count = 0;

//confirms the user wants to create a column
//boardNameInput - The name of the board to create a column in.
function confirmation(message, boardNameInput) {
  message.reply(
    `Would you like to add a column in ${boardNameInput}?\n` +
      "`yes` to create columns or `no` to cancel.\n" +
      "You have 30 seconds or else columns will not be added.\n"
  );

  //collects messages from the original message author
  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        dbCmd.findBoardByName(boardNameInput).then((val) => {
          if (!val) {
            message.channel.send(
              `${boardNameInput} doesn't exist in the db use \`%createboard\` to create it`
            );
          } else {
            columnConfiguration(message, boardNameInput);
          }
        });
      } else if (collected.first().content.toLowerCase() === "no") {
        message.channel.send("operation canceled");
      } else {
        message.reply(
          "That is not a valid response\n" + "Please retype addcolumn command"
        );
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
  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      columnNameInput = collected.first().content.toLowerCase();
      dbCmd.findBoardByName(boardNameInput).then((val) => {
        dbCmd.countBoardColumns(val.board_id).then((columnCount) => {
          let order_number = columnCount + count + 1;
          data[count] = {
            name: columnNameInput,
            column_order_number: order_number,
          };
          count++;
        });
      });
      ColumnConfirmation(message, boardNameInput);
    })
    .catch((error) => {
      console.error(error);
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

//configures the column and adds it to the data array
//boardNameInput - The name of the board to create a column in.
function ColumnConfirmation(message, boardNameInput) {
  message.reply(
    `Would you like to create another Column in board ${boardNameInput}?\n` +
      "Confirm with `yes` or deny with `no`.\n" +
      "You have 30 seconds or else board will not be made.\n"
  );

  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        columnConfiguration(message, boardNameInput);
      } else if (collected.first().content.toLowerCase() === "no") {
        populateDatabase(message, boardNameInput);
      } else {
        message.reply(
          "That is not a valid response\n" + "Please retype createboard command"
        );
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
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
          for (let i = 0; i < Object.keys(data).length; i++) {
          data[i]["created_by_user_id"] = userId;
          data[i]["board_id"] = boardModel.board_id;
          dbCmd.createColumn(data[i]).then((columnModel) => {
              data.columnTrack["column_id"] = columnModel.column_id;
              for (let j = 0; j < statusModels.length; j++) {
                data.columnTrack["column_status_id"] = statusModels[j].column_status_id;
                dbCmd.createColumnTrackRecord(data.columnTrack);
              }
            });
          }
        });
        message.channel.send(`Columns created in board ${boardNameInput}`);
        count = 0;
      } else {
        message.channel.send(`Error Occured`);
      }
    });
  }); 
}

function resetData() {
  data = {
    columnTrack: {},
  };
}

module.exports = {
  name: "addcolumn",
  description: "addcolumn <board name>",
  count: 6,
  execute(message, args) {
    let boardNameInput = args[0];

    resetData();

    if (!boardNameInput) {
      return message.reply(
        "you need to name a board!\n" + "example: %addcolumn <board name>"
      );
    } else {
      confirmation(message, boardNameInput);
    }
  },
};
