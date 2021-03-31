const config = require('./config.json')
const command = require('./commands')


  command(client, 'help', (message) => {
    message.channel.send(`
These are my supported commands:
**%help** - Displays the help menu
**%create-task- creates new task in column
**%create-column-creates new column
`)
  })

  const { prefix } = config

  client.user.setPresence({
    activity: {
      name: `"${prefix}help" for help`,
    },
  })

