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
