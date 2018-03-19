const Discord = require("discord.js");
var db = require('quick.db')

module.exports.run = async (bot, message, args, db) => {
  var chid = args[0];
  db.set('msgchannel', chid);
  db.fetch('msgchannel').then ( id => message.channel.send(`Join/Leave Message channel set to ID: ${id}`));
}

module.exports.help = {
  name: "setmsgchannel"
}
