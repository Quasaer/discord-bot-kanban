let dbCmd  = require('../dbCommands.js');
let data = {
	config:{
		id:'',
		prefix:'',
		updatedFields:{
			channel_bind_id:''
		},
		conditionalFields:{
			server_id:''
		}

	}
};  
module.exports = {
  name: "bind",
  description: "Bind!",
  count: 3,
  execute(message, args) {
    const channelId = message.channel.id;
    const guildId = message.guild.id;
    const find = dbCmd.findConfigByServerId(guildId).then((configModel) => {
      if (configModel !== null) {
        data.config.conditionalFields.server_id = configModel.server_id;
        data.config.updatedFields.channel_bind_id = channelId;
        const resp = dbCmd.updateConfig(data.config);
        message.channel.send(`The channel bind has been updated!`);
      } else {
        console.log(`A config record has not be stored yet.`);
      }
    });
  },
};