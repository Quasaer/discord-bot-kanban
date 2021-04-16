const dbCmd = require("../dbCommands.js");
let data = {};

//task Description
function taskDescription(message){
  message.reply(`Enter the task Description`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {
	    const taskDescriptionInput = collected.first().content;
      if (taskDescriptionInput !== "") {
        data.task["description"] = taskDescriptionInput;
        taskDeadlineDate(message);
      } else {
        message.reply(
          "That is not a valid response\n" + "Please retype addtask command"
        );
      } 
    }).catch(() => {
        message.reply('No answer after 30 seconds, operation canceled.');
    });
};

//asking user if they want to add a deadline date
function taskDeadlineDate(message) {
  message.reply(
    "Would you like to add a deadline date?\n" +
    "Confirm with `yes` or deny with `no`.\n" +
    "You have 30 seconds or else Task will not be made.\n"
  );

  message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1,time: 30000,})
    .then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        handleDeadlineDateInput(message);
      } else if (collected.first().content.toLowerCase() === "no") {
        finalConfirmation(message);
      } else {
        message.reply(
          "That is not a valid response\n" + "Please retype addtask command"
        );
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
};

//task deadline date
function handleDeadlineDateInput(message){
	message.reply('add Deadline date (YYYY-MM-DD)');
	message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {
		const deadlineDateInput = Date.parse(collected.first().content.toLowerCase());
		if ( deadlineDateInput !== 'NaN') {
			data.task["deadline_date_time_stamp"] = deadlineDateInput;
			finalConfirmation(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addtask command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//final confirmation to add task
function finalConfirmation(message){
	message.reply(`Changes Successfully made\n`
			+ 'Would you like to continue with these settings?\n'
			+ '`yes` to add task with new settings or `no` to cancel changes.\n'
			+ 'You have 30 seconds or else task will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			populateDatabase(message);
		} else if(collected.first().content.toLowerCase() === 'no') {	
			message.reply('Your changes have been cancelled.\n' 
						+ 'Your task has not been created');
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addtask command');
		}
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
}


function populateDatabase(message) {  
  // console.log(data.task)
  dbCmd.createTask(data.task).then(() => {
    message.reply(`changes have been successfully made for the column`);
  });
}

function setData() {
  data = {
    task:{}
  };
}

module.exports = {
  name: "addtask",
  description: "addtask <board name> <column name> <task name>",
  execute(message, args) {
    let boardNameInput = args[0];
    let columnNameInput = args[1];
    let taskNameInput = args[2];
    setData();

    if (!boardNameInput || !columnNameInput || !taskNameInput ) {
      return message.reply("you need to name a board!\n" + "example: %addtask <board name> <column name> <task name>");
    } else {
      const user = message.author.tag;
      dbCmd.findUser(user).then((userModel) =>{
        data.task["created_by_user_id"] = userModel.user_id;
      });
      dbCmd.findBoardByName(boardNameInput).then((boardModel) =>{
        if(boardModel !== null){
            dbCmd.findColumnNameByBoardIdAndName(boardModel.board_id, columnNameInput).then((columnModel) =>{
              /*
              found board
              found column
              find min column track
              */
              if(columnModel !== null){
                dbCmd.findMinColumnTrackId(columnModel.column_id).then((columnTrackId)=>{
                  data.task["column_track_id"] = columnTrackId;
                  data.task["name"] = taskNameInput;
                  taskDescription(message); 
                })
              } else {
                message.channel.send(`The column ${colummNameInput} either doesn't exist in the DB or is case sensitive`);
              }
            });

        } else {
          message.channel.send(`${boardNameInput} doesn't exist in the DB use \`%createboard\` to create it`);
        }
      });
    }
  },
};