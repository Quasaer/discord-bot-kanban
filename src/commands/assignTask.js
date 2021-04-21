const dbCmd = require("../dbCommands.js");
let data = {};

//final confirmation to add task
function finalConfirmation(message) {
  message.reply(
      "Would you like to assign this user to the task?\n" +
      "`yes` to assign the user to the task `no` to cancel changes.\n" +
      "You have 30 seconds or else task will not be made.\n"
  );

  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        populateDatabase(message);
      } else if (collected.first().content.toLowerCase() === "no") {
        message.reply(
          "Your changes have been cancelled.\n" +
            "Your assign task has not been created"
        );
      } else {
        message.reply(
          "That is not a valid response\n" + "Please retype addtask command"
        );
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

function populateDatabase(message) {
  // console.log(data.task)
  dbCmd.assignTask(data.taskAssignment).then(() => {
    message.reply(
      `changes have been successfully made for the task assignment`
    );
  });
}

function setData() {
  data = {
    taskAssignment: {},
  };
}

module.exports = {
  name: "assigntask",
  description: "assigntask <board name> <column name> <task name> <@user>",
  execute(message, args) {
    let boardNameInput = args[0];
    let columnNameInput = args[1];
    let taskNameInput = args[2];
    setData();

    if (!boardNameInput || !columnNameInput || !taskNameInput) {
      return message.reply(
        "you need to name a board!\n" +
        "example: %assigntask <board name> <column name> <task name> <@user>"
      );
    } else {
      const user = message.author.tag;
      dbCmd.findUser(user).then((userModel) => {
        data.taskAssignment["created_by_user_id"] = userModel.user_id;
      });
      dbCmd.findBoardByName(boardNameInput).then((boardModel) => {
        if (boardModel !== null) {
          dbCmd.findColumnNameByBoardIdAndName(boardModel.board_id, columnNameInput).then((columnModel) => {
            /*
              found task Id
              */
            if (columnModel !== null) {

              dbCmd.findTaskByColumnIdAndName(columnModel.column_id, taskNameInput).then((taskModel) => {
                if(taskModel !== undefined){
                  // console.log(taskModel);
                  data.taskAssignment["task_id"] = taskModel.task_id;
                  const target = message.mentions.users.first() || message.author;
                  dbCmd.findUser(target.tag).then((userModel) =>{
                    const user = target.tag.split('#');
                    if (!message.mentions.users.size) {
                      return message.reply('you need to tag a user in order to assign them!');
                    }
                    if(userModel !== null){
                      data.taskAssignment["user_id"] = userModel.user_id;
                      // console.log(data);
                      finalConfirmation(message);
                    } else {
                      message.channel.send(`${user[0]} doesn't exist in db DB`);
                    }
                  });
                } else{
                  return message.reply(
                    "The Task was not found!\n" +
                    "please check task name was corrct and capital cases were in the right palces."
                  );
                }
              });
            
            } else {
              message.channel.send(
                `The column ${colummNameInput} either doesn't exist in the DB or is case sensitive`
              );
            }
          });
        } else {
          message.channel.send(
            `${boardNameInput} doesn't exist in the DB use \`%createboard\` to create it`
          );
        }
      });
    }
  },
};
