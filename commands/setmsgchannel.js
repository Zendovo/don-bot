const Discord = require("discord.js");
const editJsonFile = require("edit-json-file");

module.exports.run = async (bot, message, args, file) => {
  var chid = args[0];
  file.set(`"msgchannel"`, chid);
}

module.exports.help = {
  name: "setmsgchannel"
}
