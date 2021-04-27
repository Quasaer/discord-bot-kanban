let dbCmd  = require('../dbCommands.js');
let data = {
  updatedFields:{},
  updateCondition:{}
};  
module.exports = {
  name: "bind",
  description: '`bind\nBind the bot to the current channel.`',
  count: 3,
  execute(message, args) {
    let channelId = message.channel.id;
    let guildId = message.guild.id;
    dbCmd.findConfigByServerId(guildId).then((configModel) => {
      if (configModel !== null) {
        data.updateCondition["config_id"] = configModel.config_id;
        data.updatedFields["channel_bind_id"] = channelId;
        dbCmd.updateConfig(data).then(()=>{
          message.channel.send(`The channel bind has been updated!`);
        });
      } else {
        console.log(`A config record has not be stored yet.`);
      }
    });
  },
};