const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
bot.commands = new Discord.Collection();
var randomstring = require("randomstring");
var db = require('quick.db')
const mysql = require("mysql");

//Bot turns on
 bot.on("ready", async () => {
   console.log(`${bot.user.username} is online!`);
   bot.user.setActivity(`${botconfig.prefix}help`);
 });

//MySQL connection
var con = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
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

  if (cmd == `${prefix}help`) {
    let helpEmbed = new Discord.RichEmbed()
    .setDescription("These commands can only be performed if you have `Bot Commander` role")
    .setColor("#ffffff")
    .addField("Basic Info", `**Prefix of bot**   | ${prefix}<command>\n**${prefix}help**   | Shows this help menu\n**${prefix}botinfo**   | Shows bot info`)
    .addField("Config Commands", `**${prefix}setmessagechannel <Channel ID>**   | Set the channel where the join/leave messages will show.\n**${prefix}setjoinmessage <content>**   | Set the join message\n**${prefix}setleavemessage <content>**   | Set the leave message\n**${prefix}setdmmessage <content>**   | Sets the message to be sent to a user's DM when he/she joins the server`)
    .addField("Other Commands", `**${prefix}messagechannel**   | Shows the message channel ID\n**${prefix}joinmessage** | Shows the set Join Message\n**${prefix}leavemessage**   | Shows the set leave message\n**${prefix}dmmessage**   | Shows the set DM message`)
    .addField("Tickets:", `**${prefix}new [User-ID]**   | Creates a new ticket. If a Staff includes id of another user is included it creates a ticket for someone else.\n**${prefix}close [id]**   | Closes given id ticket, if not given closes the ticket you are typing in. *Staff Only*`)
    .setFooter("Note: \nhelp command can be run by anyone but the rest you need the Bot Commander role.\n<> = Required | [] = Optional");
    message.channel.send(helpEmbed);
  }

  if (cmd == `${prefix}setmessagechannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var chid = args[0];
    con.query(`SELECT * FROM donbotconfig WHERE name = 'messagechannel'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${chid}' WHERE name = 'messagechannel'`;
      con.query(sql, console.log);
      var msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel has been set!`)
      .setColor("#67d81c");
      message.channel.send(msgchannelEmbed);
    });
  }

  if (cmd == `${prefix}messagechannel`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'messagechannel'", (err, rows) => {
      if(err) throw err;

      let id = rows[0].value;
      var msgchannelEmbed = new Discord.RichEmbed()
      .setDescription(`Join/Leave Message channel set to ID: ${id}`)
      .setColor("#1cd893");
      message.channel.send(msgchannelEmbed);
      });
  }

  if (cmd == `${prefix}setjoinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var jmsg = args.join(" ");
    con.query(`SELECT * FROM donbotconfig WHERE name = 'joinmessage'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${jmsg}' WHERE name = 'joinmessage'`;
      con.query(sql, console.log);
      var joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message has been set!`)
      .setColor("#67d81c");
      message.channel.send(joinmsgEmbed);
    });
  }

  if (cmd == `${prefix}joinmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'joinmessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var joinmsgEmbed = new Discord.RichEmbed()
      .setDescription(`Join Message: ${msg}`)
      .setColor("#1fba2f");
      message.channel.send(joinmsgEmbed);
      });
  }

  if (cmd == `${prefix}setleavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var lmsg = args.join(" ");
    con.query(`SELECT * FROM donbotconfig WHERE name = 'leavemessage'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${lmsg}' WHERE name = 'leavemessage'`;
      con.query(sql, console.log);
      var leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message has been set!`)
      .setColor("#67d81c");
      message.channel.send(leavemsgEmbed);
    });
  }

  if (cmd == `${prefix}leavemessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'leavemessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var leavemsgEmbed = new Discord.RichEmbed()
      .setDescription(`Leave Message: ${msg}`)
      .setColor("#ce1d1a");
      message.channel.send(leavemsgEmbed);
      });
  }

  if (cmd == `${prefix}setdmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    var dmmsg = args.join(" ");
    con.query(`SELECT * FROM donbotconfig WHERE name = 'dmmessage'`, (err, rows) => {
      let sql = `UPDATE donbotconfig SET value = '${dmmsg}' WHERE name = 'dmmessage'`;
      con.query(sql, console.log);
      var dmmsgEmbed = new Discord.RichEmbed()
      .setDescription(`DM Message has been set!`)
      .setColor("#67d81c");
      message.channel.send(dmmsgEmbed);
    });
  }

  if (cmd == `${prefix}dmmessage`) {
    if (!message.member.roles.find('name', 'Bot Commander')) return message.channel.send(":x: You do not have the permission!");
    con.query("SELECT * FROM donbotconfig WHERE name = 'dmmessage'", (err, rows) => {
      if(err) throw err;

      let msg = rows[0].value;
      var dm = msg.replace('{user}', member).replace('{members}', member.guild.memberCount);
      var dmmsgEmbed = new Discord.RichEmbed()
      .setDescription(`DM Message: ${dm}`)
      .setColor("#1fba2f");
      message.channel.send(dmmsgEmbed);
      });
    }

  if (cmd == `${prefix}new`) {
    message.channel.send("Generating Ticket ID...");
      var uid = message.author.id;
      var randomid = randomstring.generate({  length: 6,  charset: 'abcdefghijklmnopqrstuvwxyz'});
      var tid = `ticket-${randomid}`;
      var sid = message.guild.roles.find("name", "Support Team");
      var tcexists = message.guild.channels.find("name", tid);
      if (tcexists) return message.channel.send("Please execute the command again, the generated ID exists already");
      message.channel.send("Creating Ticket Channel...");
      var ticketlog = message.guild.channels.find("name", "ticket-log");
      if (!ticketlog) return message.channel.send("Error!, no `ticket-log` channel! Contact a server admin.");
      if (!args[0]) {
      message.guild.createChannel(`${tid}`, "text", [{
        id: uid,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      },
      {
        id: sid,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      },
      {
        id: message.guild.defaultRole,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      }]);
      message.channel.send("Ticket Created!");
      var createdticketEmbed = new Discord.RichEmbed()
        .setDescription("**Ticket Created**")
        .setColor("#3def15")
        .addField("Created by:", `${message.author}`, true)
        .addField("Ticket-ID:", `${tid}`, true)
        .setFooter(`User ID: ${uid}`);
      ticketlog.send(createdticketEmbed);
    } else {
      if (!message.member.roles.find("id", value)) return message.channel.send("Sorry, you can't create a ticket for someone else.");
      var auid = args[0];
      message.guild.createChannel(`${tid}`, "text", [{
        id: uid,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      },
      {
        id: sid,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      },
      {
        id: message.guild.defaultRole,
        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      },
      {
        id: auid,
        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
      }]);
      message.channel.send("Ticket Created!");
      var createdticketEmbed = new Discord.RichEmbed()
        .setDescription("**Ticket Created**")
        .setColor("#3def15")
        .addField("Created by:", `${message.author}`, true)
        .addField("Created for:", `<@${auid}>`, true)
        .addField("Ticket-ID:", `${tid}`, true)
        .setFooter(`User ID: ${uid}`);
      ticketlog.send(createdticketEmbed);
    }
  }

  if (cmd == `${prefix}close`) {
    var tlog = message.guild.channels.find("name", "ticket-log");
    var sid = message.guild.roles.find("name", "Support Team");
    if (!message.member.roles.find("name", "Support Team")) return message.channel.send("Sorry, you can't close a ticket please ask a staff to close it.");
      if (args[0]) {
        var tid = args[0];
        var tchan = message.guild.channels.find("name", `${tid}`);
        if (!tchan) return message.channel.send(":x: Given Ticket ID doesn't exist!");
        message.channel.send("Closing Ticket...");
        tchan.delete();
        message.channel.send("Ticket Closed!");
        var closetc1 = new Discord.RichEmbed()
        .setDescription("**Ticket Closed**")
        .setColor("#ed3434")
        .addField("Ticket Closed by:", `${message.author}`, true)
        .addField("Ticket-ID:", `${tchan}`, true);
        tlog.send(closetc1);
      } else {
          var channame = message.channel.name
          if (!channame.startsWith("ticket-")) return message.channel.send(":x:This is not a ticket channel!");
          if (!channame.startsWith("ticket-") && (channame.contains = "log")) return message.channel.send(":x:This is not a ticket channel!");
          message.channel.delete();
          var closetc2 = new Discord.RichEmbed()
            .setDescription("**Ticket Closed**")
            .setColor("#ed3434")
            .addField("Ticket Closed by:", `${message.author}`, true)
            .addField("Ticket-ID:", `${channame}`, true);
            tlog.send(closetc2);
    }
  }

  if (cmd == `${prefix}botinfo`) {
    let infoEmbed = new Discord.RichEmbed()
    .addField("Author", "Zendovo#4334")
    .setColor("#f44e42");
    message.channel.send(infoEmbed);
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
      member.send(dm);
      con.query("SELECT * FROM donbotconfig WHERE name = 'joinmessage'", (err, rows) => {
        if(err) throw err;

        let msg = rows[0].value;
        var jm = msg.replace('{user}', member).replace('{members}', member.guild.memberCount);
        var joinmsgEmbed = new Discord.RichEmbed()
        .setDescription(`${jm}`)
        .setColor("#1fba2f");
        msgCh.send(joinmsgEmbed);
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
        .setDescription(`${lm}`)
        .setColor("#ce1d1a");
        msgCh.send(leavemsgEmbed);
        });
    });
});

bot.login(process.env.token);
