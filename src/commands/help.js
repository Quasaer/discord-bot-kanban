const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

//export
module.exports = {
  name: "help",
  description: "Display a summary of commands!",
  count: 1,
  execute(message, args) {
    //get name + description
    let commandFiles = fs
      .readdirSync(path.resolve(__dirname, "./"))
      .filter((file) => file.endsWith(".js"));
    // stores the name + description in object format
    let allCommands = [];
    for (const file of commandFiles) {
      command = require(`./${file}`);
      allCommands.push({
        string: `**${command.name}**\n${command.description} \n\n`,
        position: command.count,
      });
    }

    //sorting the array then reversing it. This means that the command with a value of 1 is in the first index
    allCommands.sort((a, b) => (a.position < b.position ? 1 : -1)).reverse();

    /*cycles through the sorted array, gets the string part of the object and pushes it to another array. 
    This new array is then joined together for the description
    */
    sortedCommands = [];
    for (let i in allCommands) {
      sortedCommands.push(allCommands[i].string);
    }

    //define embed
    let embed = new Discord.MessageEmbed()
      .setColor("BLUE")
      //.setFooter(message.guild.name, message.guild.iconURL())
      .setTitle("Kanban Commands")
      .setDescription(sortedCommands.join(""));

    //send Embed
    message.channel.send(embed);
  },
};
