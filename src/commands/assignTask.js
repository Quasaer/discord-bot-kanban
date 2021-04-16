const dbCmd = require("../dbCommands.js");

module.exports = {
  name: "assignTask",
  description: "assignTask <board name>",
  execute(message, args) {
    let boardNameInput = args[0];
    resetData();

    if (!boardNameInput) {
      return message.reply(
        "you need to name a board!\n" + "example: %addtask <board name>"
      );
    } else {
      dbCmd.findBoardByName(boardNameInput).then((boardModel) => {
        if (boardModel !== null) {
          data.board.name = boardNameInput;
          addTaskconfirmation(message);
        } else {
          message.channel.send(
            `${boardNameInput} doesn't exist in the DB use \`%createboard\` to create it`
          );
        }
      });
    }
  },
};