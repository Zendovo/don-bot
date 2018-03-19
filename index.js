const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
bot.commands = new Discord.Collection();
var db = require('quick.db')

//Bot turns on
 bot.on("ready", async () => {
   console.log(`${bot.user.username} is online!`);
   bot.user.setActivity(`${botconfig.prefix}help`);
 });

bot.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (cmd == `${prefix}setmsgchannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var chid = args[0];
    db.set('msgchannel', chid);
    db.fetch('msgchannel').then ( id =>
      let msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel set to ID: ${id}`)
      message.channel.send(msgchannelEmbed));
  }

  if (cmd == `${prefix}msgchannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('msgchannel').then ( id =>
      let msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel ID: ${id}`)
      message.channel.send(msgchannelEmbed));
  }

  if (cmd == `${prefix}setjoinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var jmsg = args.join(" ");
    db.set('joinmessage', jmsg);
    db.fetch('joinmessage').then ( msg =>
      let joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message set to: ${msg}`)
      message.channel.send(joinmsgEmbed));
  }

  if (cmd == `${prefix}joinmsg`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('joinmessage').then ( msg =>
      let joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message: ${msg}`)
      message.channel.send(joinmsgEmbed));
  }

  if (cmd == `${prefix}setleavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var lmsg = args.join(" ");
    db.set('leavemessage', lmsg);
    db.fetch('leavemessage').then ( msg =>
      let leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message set to: ${msg}`)
      message.channel.send(msgchannelEmbed));
  }

  if (cmd == `${prefix}leavemsg`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('leavemessage').then ( msg =>
      let leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message: ${msg}`)
      message.channel.send(msgchannelEmbed));
  }

  if (cmd == `${prefix}setdmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var dmmsg = args.join(" ");
    db.set('dmmessage', dmmsg);
    db.fetch('dmmessage').then ( msg =>
      let DMmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join DM Message set to: ${msg}`)
      message.channel.send(DMmsgEmbed));
  }

  if (cmd == `${prefix}dmmsg`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('dmmessage').then ( msg =>
      let DMmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join DM Message: ${msg}`)
      message.channel.send(DMmsgEmbed));
  }
});

bot.login(process.env.token);
