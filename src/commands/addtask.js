const dbCmd = require("../dbCommands.js");
let data = {};

//asking user if they want to add a task in a board
function addTaskconfirmation(message) {
  message.reply(
    `Would you like to add a task in ${data.board.name}?\n` +
      "`yes` to add task or `no` to cancel.\n" +
      "You have 30 seconds or else columns will not be added.\n"
  );

  message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1,time: 30000,}).then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
          taskColumnConfirmation(message);
      } else if (collected.first().content.toLowerCase() === "no") {
        message.channel.send("operation canceled");
      } else {
        message.reply("That is not a valid response\n" + "Please retype addcolumn command");
      }
    })
    .catch(() => {
      message.reply("No answer after 30 seconds, operation canceled.");
    });
}

//asking user which coulmn they want to add a task in.
function taskColumnConfirmation(message) {
    message.reply(
      `In which column would you like add a task ${data.column.name}?\n` +
       "Please enter from the options given or deny with `no`.\n" +
       "You have 30 seconds or else columns will not be added.\n"
    );

    message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1,time: 30000,}).then((collected) => {
        if (collected.first().content.toLowerCase() === "yes") {
          taskLimitOption(message);
        } else if (collected.first().content.toLowerCase() === "no") {
          message.channel.send("operation canceled");
        } else {
          message.reply("That is not a valid response\n" + "Please retype addtask command");
        }
      })
      .catch(() => {
        message.reply("No answer after 30 seconds, operation canceled.");
      });
}

//asking user if they want to add a task limit to a column
function taskLimitOption(message){
	message.reply('Would you like to add a task limit to your column?\n'
				+ 'Confirm with `yes` or deny with `no`.\n'
				+ 'You have 30 seconds or else Task will not be made.\n');

	message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {

		if (collected.first().content.toLowerCase() === 'yes') {
			taskLimit(message);
		} else if(collected.first().content.toLowerCase() === 'no') {
			taskName(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addtask command');
		}     
	}).catch(() => {
				message.reply('No answer after 30 seconds, operation canceled.');
	});
};

// task limit
function taskLimit(message){
  message.channel.send(`Enter a task limit for the column`);
  message.channel.awaitMessages(m => {
      if(m.author.id != message.author.id)
          return false
      if (isNaN(m.content)){
          message.channel.send("This is not a valid response. Enter a number below.");
          return false
      }
      return true
  },{max: 1, time: 30000}).then(collected => {
      taskLimitInput = collected.first().content;
      if(!taskLimitInput)
          return message.channel.send('Time ran out. Canceled!')

      let taskLimitForColumn = Number(taskLimitInput.content)//here you have string parsed as a number if you need to
      taskName(message);
  }).catch(() => {
      message.reply('No answer after 30 seconds, operation canceled.');
  });
};


// task name
function taskName(message){message.reply(`Enter the task name`);
	message.channel.awaitMessages(m => m.author.id == message.author.id,{max: 1, time: 30000}).then(collected => {
        taskNameInput = collected.first().content;
        
        //let taskLimitForColumn = 
        
        if (taskNameInput !== "") {
          data.task["name"] = taskNameInput;
          taskDescription(message);
        }
        else {
          message.reply('That is not a valid response\n' + 'Please retype addtask command');
		   }  
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};


//task Description
function taskDescription(message){message.reply(`Enter the task Description`);
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
        addTaskAgain(message);
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
			addTaskAgain(message);
		} else {
			message.reply('That is not a valid response\n'
			+ 'Please retype addtask command');
		}     
	}).catch(() => {
		message.reply('No answer after 30 seconds, operation canceled.');
	});
};

//asking use if they want to add task again to their current column
function addTaskAgain(message) {
  message.reply(
    `Would you like to add another task in board ${data.board.name}?\n` +
      "Confirm with `yes` or deny with `no`.\n" +
      "You have 30 seconds or else board will not be made.\n"
  );

  message.channel.awaitMessages((m) => m.author.id == message.author.id, {max: 1,time: 30000,}).then((collected) => {
      if (collected.first().content.toLowerCase() === "yes") {
        taskName(message);
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
}

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
  const user = message.author.tag;

  dbCmd.findUser(user).then((userModel) =>{
		data.task["created_by_user_id"] = userModel.user_id;
    dbCmd.createTask(data.task).then((taskModel) => {
      if (taskModel) {
				dbCmd.findAllColumnStatus().then((statusModels) => {
        for (let i = 1; i <= Object.keys(data.tasks).length; i++) {
          data.tasks[i]["task_limit"] = userModel.user_id;
          data.tasks[i]["column_track_id"] = userModel.user_id;
        }
      });
      message.channel.send(`${data.task["name"]} has successfully been added to DB`);
    } else {
				message.channel.send(`Error Occured`);
			}
    });
});
}

function resetData() {
  data = {
    
    taskLimitForColumn:0,

    task: {},
    board: {},
    column:{},
    columnTrack:{},

  };
}

module.exports = {
  name: "addtask",
  description: "addtask <board name>",
  execute(message, args) {
    let boardNameInput = args[0];
    resetData();

    if (!boardNameInput) {
      return message.reply("you need to name a board!\n" + "example: %addtask <board name>");
    } else {
      dbCmd.findBoardByName(boardNameInput).then((boardModel) => {
        if (boardModel !== null) {
            data.board.name = boardNameInput;
            addTaskconfirmation(message);
        } else {
          message.channel.send(`${boardNameInput} doesn't exist in the DB use \`%createboard\` to create it`);
        }
      });
    }
  },
};