const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
bot.commands = new Discord.Collection();
var db = require('quick.db')
const mysql = require("mysql");

//Bot turns on
 bot.on("ready", async () => {
   console.log(`${bot.user.username} is online!`);
   bot.user.setActivity(`${botconfig.prefix}help`);
 });

//MySQL connection
var con = mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    user: "sql3227560",
    password: "Qfr5jq2QPa",
    database: "sql3227560"
});

con.connect(err => {
    if(err) throw err;
    console.log("Connected to database!");
    con.query("SHOW TABLES", console.log);
});

//Commands
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
    con.query(`SELECT * FROM donbotconfig WHERE name = 'messagechannel'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${chid}' WHERE name = 'messagechannel'`;
      con.query(sql, console.log);
    });
    con.query("SELECT * FROM donbotconfig WHERE name = 'messagechannel'", (err, rows) => {
      if(err) throw err;

      let id = rows[0].value;
      var msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel set to ID: ${id}`);
      message.channel.send(msgchannelEmbed);
      });
    }

  if (cmd == `${prefix}messagechannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'messagechannel'", (err, rows) => {
      if(err) throw err;

      let id = rows[0].value;
      var msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel set to ID: ${id}`);
      message.channel.send(msgchannelEmbed);
      });
  }

  if (cmd == `${prefix}setjoinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var jmsg = args.join(" ");
    con.query(`SELECT * FROM donbotconfig WHERE name = 'joinmessage'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${jmsg}' WHERE name = 'joinmessage'`;
      con.query(sql, console.log);
    });
    con.query("SELECT * FROM donbotconfig WHERE name = 'joinmessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message: ${msg}`);
      message.channel.send(joinmsgEmbed);
      });
  }

  if (cmd == `${prefix}joinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'joinmessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message: ${msg}`);
      message.channel.send(joinmsgEmbed);
      });
  }

  if (cmd == `${prefix}setleavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var lmsg = args.join(" ");
    con.query(`SELECT * FROM donbotconfig WHERE name = 'leavemessage'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${lmsg}' WHERE name = 'leavemessage'`;
      con.query(sql, console.log);
    });
    con.query("SELECT * FROM donbotconfig WHERE name = 'leavemessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message: ${msg}`);
      message.channel.send(leavemsgEmbed);
      });
  }

  if (cmd == `${prefix}leavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'leavemessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message: ${msg}`);
      message.channel.send(leavemsgEmbed);
      });
  }

  if (cmd == `${prefix}setdmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var dmmsg = args.join(" ");
    con.query(`SELECT * FROM donbotconfig WHERE name = 'dmmessage'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${dmmsg}' WHERE name = 'dmmessage'`;
      con.query(sql, console.log);
    });
    con.query("SELECT * FROM donbotconfig WHERE name = 'dmmessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var dmmsgEmbed = new Discord.RichEmbed()
      .setDescription(`DM Message: ${msg}`);
      message.channel.send(dmmsgEmbed);
      });
  }

  if (cmd == `${prefix}dmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'dmmessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var dmmsgEmbed = new Discord.RichEmbed()
      .setDescription(`DM Message: ${msg}`);
      message.channel.send(dmmsgEmbed);
      });
    }
});

bot.on('guildMemberAdd', member => {
  con.query("SELECT * FROM donbotconfig WHERE name = 'messagechannel'", (err, rows) => {
    if(err) throw err;

    let id = rows[0].value;
    var msgCh = member.guild.channels.find("id", id);
    con.query("SELECT * FROM donbotconfig WHERE name = 'dmmessage'", (err, rows) => {
      if(err) throw err;

      let dm = rows[0].value;
      member.channel.send(dm);
      con.query("SELECT * FROM donbotconfig WHERE name = 'joinmessage'", (err, rows) => {
        if(err) throw err;

        let msg = rows[0].value;
        var jm = msg.replace('{user}', member).replace('{members}', member.guild.memberCount);
        var joinmsgEmbed = new Discord.RichEmbed()
        .setDescription(`${jm}`);
        .setColor("#1fba2f")
        message.channel.send(joinmsgEmbed);
        });
      });
    });
});

bot.on('guildMemberRemove', member => {
  con.query("SELECT * FROM donbotconfig WHERE name = 'messagechannel'", (err, rows) => {
    if(err) throw err;

    let id = rows[0].value;
    var msgCh = member.guild.channels.find("id", id);
      con.query("SELECT * FROM donbotconfig WHERE name = 'leavemessage'", (err, rows) => {
        if(err) throw err;

        let msg = rows[0].value;
        var lm = msg.replace('{user}', member).replace('{members}', member.guild.memberCount);
        var leavemsgEmbed = new Discord.RichEmbed()
        .setDescription(`${lm}`);
        .setColor("#ce1d1a")
        message.channel.send(leavemsgEmbed);
        });
      });
    });
});

bot.login(process.env.token);
