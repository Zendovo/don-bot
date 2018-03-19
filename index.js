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

  if (cmd == `${prefix}setmessagechannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var chid = args[0];
    db.set('msgchannel', chid);
    db.fetch('msgchannel').then ( id => {
      var msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel set to ID: ${id}`)
      message.channel.send(msgchannelEmbed)});
  }

  if (cmd == `${prefix}messagechannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('msgchannel').then ( id => {
      var msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel ID: ${id}`)
      message.channel.send(msgchannelEmbed)});
  }

  if (cmd == `${prefix}setjoinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var jmsg = args.join(" ");
    db.set('joinmessage', jmsg);
    db.fetch('joinmessage').then ( msg => {
      var joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message set to: ${msg}`)
      message.channel.send(joinmsgEmbed)});
  }

  if (cmd == `${prefix}joinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('joinmessage').then ( msg => {
      var joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message: ${msg}`)
      message.channel.send(joinmsgEmbed)});
  }

  if (cmd == `${prefix}setleavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var lmsg = args.join(" ");
    db.set('leavemessage', lmsg);
    db.fetch('leavemessage').then ( msg => {
      var leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message set to: ${msg}`)
      message.channel.send(leavemsgEmbed)});
  }

  if (cmd == `${prefix}leavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('leavemessage').then ( msg => {
      var leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message: ${msg}`)
      message.channel.send(leavemsgEmbed)});
  }

  if (cmd == `${prefix}setdmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var dmmsg = args.join(" ");
    db.set('dmmessage', dmmsg);
    db.fetch('dmmessage').then ( msg => {
      var DMmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join DM Message set to: ${msg}`)
      message.channel.send(DMmsgEmbed)});
  }

  if (cmd == `${prefix}dmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    db.fetch('dmmessage').then ( msg => {
      var DMmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join DM Message: ${msg}`)
      message.channel.send(DMmsgEmbed)});
  }
});

bot.on('guildMemberAdd', member => {
  db.fetch(`msgchannel`).then (i => {
    db.fetch(`dmmessage`).then (dm => {
      db.fetch(`joinmessage`).then (j => {
        var msgCh = guild.channels.find("id", i);
        var jm = j.replace('{user}', member).replace('{members}', member.guild.memberCount);
        var Join = new Discord.RichEmbed()
        .setDescription(jm)
        .setColor("#1fba2f")
        msgCh.send(Join);
        member.send(dm);
      })
    })
  })
});

bot.on('guildMemberRemove', member => {
  db.fetch(`msgchannel`).then (i => {
    db.fetch(`leavemessage`).then (l => {
      var msgCh = guild.channels.find("id", i);
      var lm = l.replace('{user}', member).replace('{members}', member.guild.memberCount);
      var Leave = new Discord.RichEmbed()
      .setDescription(lm)
      .setColor("#1fba2f")
      msgCh.send(Leave);
    })
  })
});

bot.login(process.env.token);
