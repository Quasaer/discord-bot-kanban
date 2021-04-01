module.exports = {
name: 'help',
description:'Help!',
execute(message, args) {
message.channel.send(`
These are my supported commands:
**%help - Displays the help menu
**%create-task- creates new task in column
**%create-column-creates new column
`);


},



};