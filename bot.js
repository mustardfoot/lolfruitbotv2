const Discord = require('discord.js');
const client = new Discord.Client();

bot.on('ready', () => {
	console.log("ok letsa go");
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

bot.on('message', message => {
	if(message.author === bot.user) return;
  if(message.guild && message.guild.id === '355836687777267712' && message.guild.available === true) {
    if (message.content === 'knife me daddy') {
      message.channel.send('*knifes*');
    }
  }
 });

client.login(process.env.BOT_TOKEN)
