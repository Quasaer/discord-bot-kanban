const dbCmd = require("../dbCommands.js");
let data = {};

//asking user if they want to assign user to the task
function assignTaskConfirmation(message) {
  message.reply(
    "Would you like to assign the user to the task?\n" +
      "Confirm with `yes` or deny with `no`.\n" +
      "You have 30 seconds or else Task will not be made.\n"
  );

  message.channel
    .awaitMessages((m) => m.author.id == message.author.id, {
      max: 1,
      time: 30000,
    })
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        finalConfirmation(message);
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

//final confirmation to add task
function finalConfirmation(message) {
  message.reply(
    `Changes Successfully made\n` +
      "Would you like to continue with these settings?\n" +
      "`yes` to assign the task to the user with new settings or `no` to cancel changes.\n" +
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
  name: "assignTask",
  description: "assigntask <board name> <column name> <task name> <@user>",
  execute(message, args) {
    let boardNameInput = args[0];
    let taskNameInput = args[1];
    let columnNameInput = args[2];
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
      dbCmd.findBoardByName(boardNameInput).then((taskModel) => {
        if (taskModel !== null) {
          dbCmd.findTaskId(taskModel.task_id).then((columnModel) => {
            /*
              found task Id
              */
            if (columnModel !== null) {
              dbCmd.findColumnNameByBoardIdAndName(columnModel.column_id).then((taskId) => {
                  data.taskAssignment["task_id"] = taskId;
                  assignTaskConfirmation(message);
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
