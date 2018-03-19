const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
bot.commands = new Discord.Collection();
const editJsonFile = require("edit-json-file");

let file = editJsonFile(`${__dirname}/botconfig.json`);

fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if (jsfile.length <= 0){
    console.log("Couldn't find commands.")
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });

});

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

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args,prefix,file);
});

bot.login("NDI1MjEwNjU2NTY0NzA3MzI4.DZEIHg.5SRwryq7LR3NW2bj-l7E5e3qJA0");
