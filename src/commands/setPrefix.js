let dbCmd  = require('../dbCommands.js');
let data = {
  updatedFields:{},
  updateCondition:{}
};    
module.exports = {
  name: "setprefix",
  description: '`setprefix <prefix>\nChange the prefix for the bot'+"'"+'s commands.`',
  count: 2,
  execute(message, args) {
    let guildId = message.guild.id;
    dbCmd.findConfigByServerId(guildId).then((configModel) => {
      let newPrefix = args[0];
      if (configModel !== null) {
        if (newPrefix == configModel.prefix) {
          message.channel.send(`That prefix is already set!`);
        } else {
          data.updatedFields["prefix"] = newPrefix;
          data.updateCondition["config_id"] = configModel.config_id;
          dbCmd.updateConfig(data).then(()=>{
            message.channel.send(`The prefix has been updated!`);
          });
        }
      } else {
        console.log(`A config record has not be stored yet.`);
      }
    });
  },
};