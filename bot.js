const Discord = require('discord.js');
const client = new Discord.Client();
var pref = "!";
var lookingfor = false;
var offservers = {

};
var fortunes = [
  "Yes",
  "No",
  "Maybe",
  "Most Likely",
  "I'm Not Certain",
  "Ask me Again Later"
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(title,mod,user,server){
  server.channels.forEach(function(channel){
    if (channel.name.indexOf('logs') !== -1){
      channel.send({"embed": {
    "title": "Action Info:",
    "color": 14680064,
    "timestamp": new Date(),
    "author": {
      "name": "knife logs | "+title,
      "icon_url": client.user.avatarURL
    },
    "fields": [
      {
        "name": "Moderator",
        "value": mod,
        "inline": true
      },
      {
        "name": "User",
        "value": user,
        "inline": true
      }
    ]
  }})
    }
  })
}

function cmdoutput(title,desc,channel){
  channel.send({embed: {
    color: 14680064,
    author: {
      name: "Command Ran",
      icon_url: client.user.avatarURL
    },
    title: title,
    description: desc,
    timestamp: new Date(),
    footer: {
      text: "knifebot"
    }
  }})
}

client.on('ready', () => {
  client.user.setGame('knife Commands')
  console.log('I am ready!');
});
client.on('message', function(message) {
  if (message.content.indexOf('TROLL') !== -1 && message.author.equals(client.user)){
    message.delete(100)
  }
  if (message.author.equals(client.user) && lookingfor === true){
    lookingfor = false;
    message.delete(1000);
  }
  if (message.author.equals(client.user)) return;
  var args = message.content.substring(pref.length).split(" ");
  var word = message.content.toLowerCase()
  var userlist = message.mentions.users;
  userlist.forEach(function(user){
    if (word.indexOf('fuck') !== -1 && user === client.user){
      message.channel.send("FUCK YOU TOO, <@"+message.author.id+">");
    }
  })
  if (!message.content.startsWith(pref)) return;
  switch(args[0].toLowerCase()) {
    case "test" :
      message.channel.send('ok cool');
      break;
    case "troll" :
      if (message.author.id === "135743153427709953"){
        message.delete()
        for(x = 0; x < 5; x = x + 1) {
          var userlist = message.mentions.members;
          userlist.forEach(function(user){
            setTimeout(function() {message.channel.send("TROLL <@"+user.id+">");},100*x);
          })
        }
      }
      break;
    case "8ball" :
      var outcum = "There has been an error, Sorry! Please try again"
      if (args[1]) outcum = fortunes[Math.floor(Math.random()*fortunes.length)];
      cmdoutput('8Ball',outcum + ", <@" + message.author.id + ">",message.channel)
      break;
    case "purge" :
      if (args[1]){
      var channel = message.channel
      var found = 0
      channel.messages.forEach(function(msg){
        if (found < args[1]){
          msg.delete();
          found=found+1;
        }
      })
      lookingfor = true;
      cmdoutput("Purge","Successfully purged "+args[1]+" messags.",channel);
      }
      break;
    case "say" :
      if (message.author.id === "135743153427709953"){
        var streing = "";
        var thing = 1;
        args.forEach(function(arg){
          if (thing != 1){
          streing = streing+" "+arg;
        } else {
          thing = 2;
        }
        })
        message.channel.send(streing);
        message.delete()
        break;
      }
    case "freshprince" :
      if (message.channel.name === "bot_chat" || message.channel.name === "bot-chat") {
      message.channel.send({embed: {
      color: 14680064,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      title: "Fresh Prince",
      description: "Now this is a story all about how\nMy life got flipped-turned upside down\nAnd I'd like to take a minute\nJust sit right there\nI'll tell you how I became the prince of a town called Bel-Air\nIn west Philadelphia born and raised\nOn the playground was where I spent most of my days\nChillin' out maxin' relaxin' all cool\nAnd all shooting some b-ball outside of the school\nWhen a couple of guys who were up to no good\nStarted making trouble in my neighborhood\nI got in one little fight and my mom got scared\nShe said, \"You're movin' with your auntie and uncle in Bel-Air.\"\nI begged and pleaded with her day after day\nBut she packed my suitcase and sent me on my way\nShe gave me a kiss and then she gave me my ticket.\nI put my Walkman on and said, \"I might as well kick it.\"\nFirst class, yo, this is bad\nDrinking orange juice out of a champagne glass.\nIs this what the people of Bel-Air living like?\nHmm, this might be alright.\nBut wait I hear they're prissy, bourgeois, all that\nIs this the type of place that they just send this cool cat?\nI don't think so\nI'll see when I get there\nI hope they're prepared for the prince of Bel-Air\nWell, the plane landed and when I came out\nThere was a dude who looked like a cop standing there with my name out\nI ain't trying to get arrested yet\nI just got here\nI sprang with the quickness like lightning, disappeared\nI whistled for a cab and when it came near\nThe license plate said \"Fresh\" and it had dice in the mirror\nIf anything I could say that this cab was rare\nBut I thought, \"Nah, forget it.\"\n- \"Yo, home to Bel-Air.\"\nI pulled up to the house about 7 or 8\nAnd I yelled to the cabbie, \"Yo home smell ya later.\"\nI looked at my kingdom\nI was finally there\nTo sit on my throne as the Prince of Bel-Air",
      timestamp: new Date(),
      footer: {
        text: "knife bot"
      }
      }})
      }
      break;
    case "mute" :
      var nub = -1
      args.forEach(function(role){
        nub=nub+1
      })
      var userlist = message.mentions.members; // Saving userlist to a variable
      userlist.forEach(function(user){
        if (message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","moderator")) >= 0 && message.member.highestRole.comparePositionTo(user.highestRole) > 0 ) {
          if (message.member.guild.roles.find("name","Muted") || message.member.guild.roles.find("name","muted")) {
          if (message.member.guild.roles.find("name","Muted")) {
           user.addRole(message.member.guild.roles.find("name","Muted"))
          }
          if (message.member.guild.roles.find("name","muted")) {
           user.addRole(message.member.guild.roles.find("name","muted"))
          }
          if (parseInt(args[nub])) {
            setTimeout(function(){
              var roles = user.roles
              roles.forEach(function(role){
                if (role.name === "muted" || role.name === "Muted") {
                  user.removeRole(role)
                  log('Automatic Unmute | '+time,"knife Bot","<@"+user.id+">",message.channel.guild)
                }
              })
            }, parseInt(args[nub])*60000);
          }
          var time = "Forever"
          if (args && parseInt(args[nub])) time = parseInt(args[nub])+" Minutes";
          cmdoutput("Mute | "+time,"<@"+user.id+"> has been muted.",message.channel)
          log('Mute | '+time,"<@"+message.author.id+">","<@"+user.id+">",message.channel.guild)
            } else {
            cmdoutput("Error","Failed to find muted role.",message.channel)
          }
        }})
      break;
      case "unmute" :
        var userlist = message.mentions.members; // Saving userlist to a variable
        userlist.forEach(function(user){
          if (message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","moderator")) >= 0 && message.member.highestRole.comparePositionTo(user.highestRole) > 0 ) {
          var roles = user.roles
          roles.forEach(function(role){
            if (role.name === "muted" || role.name === "Muted") {
              user.removeRole(role)
              cmdoutput("Unmute","<@"+user.id+"> has been unmuted.",message.channel)
              log('Manual Unmute',"<@"+message.author.id+">","<@"+user.id+">",message.channel.guild)
            }
          })
          }
          });
        break;
  }
});

client.login(process.env.BOT_TOKEN);
