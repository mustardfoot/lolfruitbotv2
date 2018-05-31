const Discord = require('discord.js');
const client = new Discord.Client();
var pref = "!";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
      text: "lolfruit"
    }
  }})
}

client.on('ready', () => {
  console.log('hell yeah');
});
client.on('messageUpdate', (omessage, message) => {
  var dothedo = false;
  omessage.attachments.forEach(function(att){
    dothedo = true;
  })
  if (omessage.content.toLowerCase().indexOf('http') === -1 && omessage.content.toLowerCase().indexOf('discord.gg') === -1){
  if (message.content.toLowerCase().indexOf('http') !== -1 || message.content.toLowerCase().indexOf('discord.gg') !== -1){
    var okay = false
    var roles = message.member.roles
    roles.forEach(function(role){
     if (role.name === "permit" || role.name === "moderators") {
      okay = true;
      dothedo = true;
      if (role.name === "permit") {
        message.member.removeRole(role);
      }
     }
    })
    if (okay !== true){
     message.delete()
    }
  }
  }
  var doit = false;
  message.attachments.forEach(function(att){
    doit = true;
  })
  if (doit === true && dothedo === false){
    var okay = false;
    var roles = message.member.roles
    roles.forEach(function(role){
     if (role.name === "permit" || role.name === "moderators") {
      okay = true;
      if (role.name === "permit") {
        message.member.removeRole(role);
      }
     }
    })
    if (okay !== true){
     message.delete()
    }
  }
});
client.on('message', function(message) {
 try{
  if (message.author.equals(client.user)) return;
  var dothedo = false;
  if (message.channel.name !== "raid-announcements" && (message.content.toLowerCase().indexOf('http') !== -1 || message.content.toLowerCase().indexOf('discord.gg') !== -1)){
    var okay = false
    if(message.member){
    var roles = message.member.roles
    roles.forEach(function(role){
     if (role.name === "permit" || role.name === "moderators") {
      okay = true;
      dothedo = true;
      if (role.name === "permit") {
        message.member.removeRole(role);
      }
     }
    })
    }
    if (okay !== true){
     message.delete()
    }
  }
  var doit = false;
  message.attachments.forEach(function(att){
    doit = true;
  })
  if (message.channel.name !== "raid-announcements" && doit === true && dothedo === false){
    var okay = false;
    if(message.member){
    var roles = message.member.roles
    roles.forEach(function(role){
     if (role.name === "permit" || role.name === "moderators") {
      okay = true;
      if (role.name === "permit") {
        message.member.removeRole(role);
      }
     }
    })
    }
    if (okay !== true){
     message.delete()
    }
  }
  var args = message.content.substring(pref.length).split(" ");
  var word = message.content.toLowerCase()
  var userlist = message.mentions.users;
  if (!message.content.startsWith(pref)) return;
  switch(args[0].toLowerCase()) {
    case "test" :
      message.channel.send('ok cool');
      break;
    case "permit" :
      if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","moderators")) >= 0){
        var userlist = message.mentions.members;
        userlist.forEach(function(user){
          user.addRole(message.member.guild.roles.find("name","permit"));
          cmdoutput('Permit',"<@"+user.id+"> has been permitted to post a link, image, or file.",message.channel);
        })
      }
      break;
    case "revokepermit" :
      if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","moderators")) >= 0){
        var userlist = message.mentions.members;
        userlist.forEach(function(user){
        var roles = user.roles
        roles.forEach(function(role){
          if (role.name === "permit") {
            cmdoutput('Revokepermit',"<@"+user.id+">'s permit has been removed.",message.channel);
            user.removeRole(role)
          }
        })
        })
      }
      break;
  }
 }
 finally {
 }
});

client.login(process.env.BOT_TOKEN);
