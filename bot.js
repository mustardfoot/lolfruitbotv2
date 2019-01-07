const Discord = require('discord.js');
const Trello = require("node-trello");
const Axios = require("axios");
const Noblox = require("noblox.js");
const t = new Trello(process.env.T_KEY,process.env.T_TOKEN);
const client = new Discord.Client();
var pref = "!"
var sEmoji;
var fEmoji;
var guild;
var commands = [];
Noblox.cookieLogin(process.env.ROBLOSECURITY)
.then(() => {

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function diff_minutes(dt2, dt1, add)
   {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.round(diff-add);

   }

   function checkpermit(message,oldmessage){
     var good = true;
     if(!oldmessage && message.channel && message.channel.name !== "raid-announcements"){
       var links = false;
       var attachments = false;
       if(message.guild && message.guild === guild){
         if (message.content.toLowerCase().indexOf('http') !== -1 || message.content.toLowerCase().indexOf('discord.gg') !== -1 || message.content.toLowerCase().indexOf('://') !== -1){
           links = true;
           good = false;
           if(message.member){
             if(guild.roles.find("name","lolfruit squad")){
               if(message.member.highestRole.comparePositionTo(guild.roles.find("name","lolfruit squad")) >= 0){
                 good = true;
               }
             }
             if(good === false){
               links = false;
             }
           }

         }
         message.attachments.forEach(function(att){
           attachments = true;
         })
         if (attachments === true && links === false){
           if(message.member){
             if(guild.roles.find("name","lolfruit squad")){
               if(message.member.highestRole.comparePositionTo(guild.roles.find("name","lolfruit squad")) >= 0){
                 good = true;
               }
             }
           }
         }
       }
     }
     if(good === false){
       message.delete();
     }
   }

  var getuserfromid = function(id) {
    return new Promise(function(resolve, reject){
       if(id.substring(0,2) === "<@" && id.substring(id.length-1) === ">" && Number(id.substring(2,id.length-1))){
         client.fetchUser(id.substring(2,id.length-1)).then((user) => {
           if(user){
             resolve(user);
           }else{
             reject(null);
           }
         });
       }else if(id.substring(0,3) === "<@!" && id.substring(id.length-1) === ">" && Number(id.substring(3,id.length-1))){
         client.fetchUser(id.substring(3,id.length-1)).then((user) => {
           if(user){
             resolve(user);
           }else{
             reject(null);
           }
         });
       }else{
         reject(null);
       }
    })
  }

  function getmemberfromid(id){
    if(id.substring(0,2) === "<@" && id.substring(id.length-1) === ">" && Number(id.substring(2,id.length-1))){
      return guild.members.get(id.substring(2,id.length-1));
    }else if(id.substring(0,3) === "<@!" && id.substring(id.length-1) === ">" && Number(id.substring(3,id.length-1))){
      return guild.members.get(id.substring(3,id.length-1));
    }else{
      return null
    }
  }

  function addcommand(name,aliases,desc,minrank,does){
      commands.push({name:name,aliases:aliases,desc:desc,minrank:minrank,does:does});
  }

  addcommand("test",["check"],"This command will respond if the bot is online. A simple test to make sure the bot isn't down.","",function(args,message){
    message.channel.send(sEmoji+" **The bot is active!**");
  });

  addcommand("accept",["rank"],"This command will rank someone to squad in the group and the discord.","lolfruit owner",function(args,message){
    if(message.guild && message.guild === guild){
      message.delete();
      if(args[1]){
        var mentionedmember = getmemberfromid(args[1]);
        if(mentionedmember){
          if(args[2] && Number(args[2])){
            Axios.get("https://api.roblox.com/Users/"+args[2])
            .then((data) => {
              data = data["data"]
              if(data["errors"] || !data["Username"]){
                message.channel.send("**"+fEmoji+" This user does not exist on roblox.**")
                .then((msg) => {
                  msg.delete(3000);
                });
                return;
              }
              if(data["Username"].substring(0,8).toLowerCase() !== "lolfruit"){
                message.channel.send("**"+fEmoji+" This user's account does not start with *lolfruit*.**")
                .then((msg) => {
                  msg.delete(3000);
                });
                return;
              }
              Noblox.getRankInGroup(3288652,args[2])
              .then((ranking) => {
                if(ranking < 1){
                  message.channel.send("**"+fEmoji+" This user is not in the lolfruit group.**")
                  .then((msg) => {
                    msg.delete(3000);
                  });
                  return;
                }else if(ranking > 25){
                  if(!guild.roles.find("name","lolfruit squad")){
                    message.channel.send("**"+fEmoji+" There is no lolfruit squad rank in the Discord!**")
                    .then((msg) => {
                      msg.delete(3000);
                    });
                    return;
                  }
                  if(mentionedmember.highestRole.comparePositionTo(guild.roles.find("name","lolfruit squad")) >= 0){
                    message.channel.send("**"+fEmoji+" This user is already ranked in the Discord and group!**")
                    .then((msg) => {
                      msg.delete(3000);
                    });
                    return;
                  }else{
                    message.channel.send("**"+fEmoji+" This user is already ranked in the group.**")
                    .then((msg) => {
                      msg.delete(3000);
                    });
                    return;
                  }
                }
                Noblox.changeRank({group: 3288652, target: Number(args[2]), change:1})
                .then(() => {
                  if(!guild.roles.find("name","lolfruit squad")){
                    message.channel.send("**"+fEmoji+" User has been ranked in the group, but there is no lolfruit rank in the Discord.**")
                    .then((msg) => {
                      msg.delete(5000);
                    });
                    return;
                  }
                  mentionedmember.addRole(guild.roles.find("name","lolfruit squad"))
                  mentionedmember.setNickname(data["Username"]);
                  message.channel.send("**"+sEmoji+" The user has been ranked in the group and Discord.**")
                })
                .catch((err) => {
                  message.channel.send('**'+fEmoji+" "+err+'**');
                })
              });
            });
          }else{
            message.channel.send("**"+fEmoji+" Please specify a roblox userid to accept.**")
            .then((msg) => {
              msg.delete(3000);
            });
          }
        }else{
          message.channel.send("**"+fEmoji+" The specified user cannot be found.**")
          .then((msg) => {
            msg.delete(3000);
          });
        }
      }else{
        message.channel.send("**"+fEmoji+" Please specify a discord user to accept.**")
        .then((msg) => {
          msg.delete(3000);
        });
      }
    }
  });

  var purgemsgs = [""," *The specified number was above the max of 100, so 100 messages were purged instead.*"," *The specified number was below the minumum of 2, so 2 messages were purged instead.*"]

  addcommand("purge",["bulkdelete"],"This command will delete the amount of messages specified in the channel the command was sent in.","moderator",function(args,message){
    if(message.guild && message.guild === guild){
      if(message.channel && message.channel.name !== "logs"){
        if(args[1] && Number(args[1])){
          args[1] = Math.round(args[1]);

          var added = 0
          if(args[1] > 100){
            args[1] = 100
            added = 1
          }else if(args[1] < 2){
            args[1] = 2
            added = 2
          }
          message.delete()
          .then(() => {
            message.channel.fetchMessages({limit: args[1]})
            .then((found) => {
              message.channel.send("**"+found.size+"** " + "messages found, deleting...")
              .then((msg) => {
                message.channel.bulkDelete(found)
                .then(() => {
                  msg.edit("**"+found.size+"** " + "messages have been purged."+purgemsgs[added])
                  msg.delete(5000);
                  guild.channels.forEach(function(channel){
                    if(channel.name === "logs"){
                      channel.send({"embed": {
                        "description":"Purge",
                        "timestamp": new Date(),
                        "color": 13632027,
                        "fields": [
                          {
                            "name": "Staff Member",
                            "value": "<@"+message.author.id+">",
                            "inline": true
                          },
                          {
                            "name": "Channel",
                            "value": "<#"+message.channel.id+">",
                            "inline": true
                          },
                          {
                            "name": "Amount of Messages",
                            "value": found.size
                          }
                        ]
                      }})
                    }
                  });
                });
              });
            });
          });
        }else{
          message.channel.send("**"+fEmoji+" Please specify how many messages to delete.**")
          .then((msg) => {
            msg.delete(3000);
          });
        }
      }
    }
  });

  addcommand("ban",["bean"],"This command will ban someone from joining the server permanently.","moderator",function(args,message){
    if(message.guild && message.guild === guild){
      message.delete()
      if(args[1]){
        var mentionedmember = getmemberfromid(args[1]);
        getuserfromid(args[1]).then((mentioneduser) => {
          if (mentionedmember){
            if(mentionedmember.user !== client.user){
              if(message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0){
                var reason = "No Reason Provided"
                if(args[2]){
                  reason = "";
                  args.forEach(function(arg,n){
                    if(n > 1){
                      if(n > 2){
                        reason = reason+" "
                      }
                      reason = reason+arg
                    }
                  });
                }
                mentionedmember.user.createDM().then((boi) => {
                  boi.send('**You have been banned from the server for ['+reason+']**')
                  guild.ban(mentionedmember,{reason: reason})
                  message.channel.send(sEmoji+" **<@"+mentionedmember.id+"> has been banned.**");
                  guild.channels.forEach(function(channel){
                    if(channel.name === "logs"){
                      channel.send({"embed": {
                        "description":"Ban",
                        "timestamp": new Date(),
                        "fields": [
                          {
                            "name": "Staff Member",
                            "value": "<@"+message.author.id+">",
                            "inline": true
                          },
                          {
                            "name": "User",
                            "value": "<@"+mentionedmember.id+">",
                            "inline": true
                          },
                          {
                            "name": "Reason",
                            "value": reason
                          }
                        ]
                      }})
                    }
                  });
                });
              }else{
                message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
                .then((msg) => {
                  msg.delete(3000);
                });
              }
            }else{
              message.channel.send("**"+fEmoji+" You can't ban the bot.**")
              .then((msg) => {
                msg.delete(3000);
              });
            }
          }else if(mentioneduser){
            if(mentioneduser !== client.user){
              var reason = "No Reason Provided"
              if(args[2]){
                reason = "";
                args.forEach(function(arg,n){
                  if(n > 1){
                    if(n > 2){
                      reason = reason+" "
                    }
                    reason = reason+arg
                  }
                });
              }
              guild.ban(mentioneduser,{reason: reason})
              message.channel.send(sEmoji+" **"+mentioneduser.tag+" has been banned.**");
              guild.channels.forEach(function(channel){
                if(channel.name === "logs"){
                  channel.send({"embed": {
                    "description":"Ban",
                    "timestamp": new Date(),
                    "fields": [
                      {
                        "name": "Staff Member",
                        "value": "<@"+message.author.id+">",
                        "inline": true
                      },
                      {
                        "name": "User",
                        "value": mentioneduser.tag,
                        "inline": true
                      },
                      {
                        "name": "Reason",
                        "value": reason
                      }
                    ]
                  }})
                }
              });
            }else{
              message.channel.send("**"+fEmoji+" You can't ban the bot.**")
              .then((msg) => {
                msg.delete(3000);
              });
            }
          }
        }).catch(() => {
          message.channel.send(fEmoji+" **Sorry, I can't find that user!**")
          .then((msg) => {
            msg.delete(3000);
          });
        });
      }
    }
  });

  addcommand("kick",[],"This command will kick someone out of the server.","moderator",function(args,message){
    if(message.guild && message.guild === guild){
      message.delete()
      if(args[1]){
        var mentionedmember = getmemberfromid(args[1]);
        if (mentionedmember){
          if(mentionedmember.user !== client.user){
            if(message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0){
              var reason = "No Reason Provided"
              if(args[2]){
                reason = "";
                args.forEach(function(arg,n){
                  if(n > 1){
                    if(n > 2){
                      reason = reason+" "
                    }
                    reason = reason+arg
                  }
                });
              }
              mentionedmember.user.createDM().then((boi) => {
                boi.send('**You have been kicked from the server for ['+reason+']**')
                mentionedmember.kick()
                message.channel.send(sEmoji+" **<@"+mentionedmember.id+"> has been kicked.**");
                guild.channels.forEach(function(channel){
                  if(channel.name === "logs"){
                    channel.send({"embed": {
                      "description":"Kick",
                      "timestamp": new Date(),
                      "fields": [
                        {
                          "name": "Staff Member",
                          "value": "<@"+message.author.id+">",
                          "inline": true
                        },
                        {
                          "name": "User",
                          "value": "<@"+mentionedmember.id+">",
                          "inline": true
                        },
                        {
                          "name": "Reason",
                          "value": reason
                        }
                      ]
                    }})
                  }
                });
              });
            }else{
              message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
              .then((msg) => {
                msg.delete(3000);
              });
            }
          }else{
            message.channel.send("**"+fEmoji+" You can't kick the bot.**")
            .then((msg) => {
              msg.delete(3000);
            });
          }
        }
      }
    }
  });

  addcommand("commands",["cmds","help","?"],"This command displays all the commands avaliable for use by the user running the command. Supplying it with a command to look up will provide further detail on said command.","",function(args,message){
      if(message.guild && message.guild === guild){
        if(!args[1]){
          var commandsamount = 0
          var viablecommands = ""
          var firstone = true;
          var theirmember = message.member
          commands.forEach(function(command){
            if(command.minrank === "" || guild.roles.find("name",command.minrank)){
              if(command.minrank === "" || theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                if(firstone === true){
                  firstone = false;
                  viablecommands = viablecommands+capitalizeFirstLetter(command.name);
                }else{
                  viablecommands = viablecommands+", "+capitalizeFirstLetter(command.name);
                }
                commandsamount = commandsamount+1;
              }
            }
          });
          message.channel.send({"embed": {
            "title": "You have access to ("+commandsamount+") commands",
            "description": "``"+viablecommands+"``",
            "footer": {
              "text": "To learn more about a command, say !help [command name] and you will be shown more information about it."
            }
          }})
        }else{
          var saidcommand = args[1].toLowerCase();
          var alreadycommanded = false;
          var theirmember = message.member
          commands.forEach(function(command){
              if(alreadycommanded === false){
                var isalias = false;
                var firstone = true;
                var aliases = ""
                command.aliases.forEach(function(alias){
                  if(firstone === true){
                    firstone = false;
                    aliases = aliases+capitalizeFirstLetter(alias);
                  }else{
                    aliases = aliases+", "+capitalizeFirstLetter(alias);
                  }
                  if(saidcommand === alias){
                    isalias = true;
                  }
                });
                if(aliases === ""){
                  aliases = "None";
                }
                var itsminrank = "None"
                if(command.minrank !== ""){
                  itsminrank = capitalizeFirstLetter(command.minrank);
                }
              	if(command.name === saidcommand || isalias === true){
                  if(command.minrank === ""){
                    message.channel.send({"embed": {
                    	"description": "`Displaying Info About: ["+capitalizeFirstLetter(command.name)+"]`",
                    	"fields": [
                    		{
                    			"name": "Aliases:",
                    			"value": aliases
                    		},
                    		{
                    			"name": "Description:",
                    			"value": command.desc
                    		},
                    		{
                    			"name": "Minimum Rank:",
                    			"value": "None"
                    		}
                    	]
                    }})
                  }else{
                    if(guild){
                      if(guild.roles.find("name",command.minrank)){
                        guild.fetchMember(message.author).then((theirmember) => {
                          if(!theirmember){
                            message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                            .then((msg) => {
                              msg.delete(3000);
                            });
                          }else{
                            if(theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                              message.channel.send({"embed": {
                                "description": "`Displaying Info About: ["+capitalizeFirstLetter(command.name)+"]`",
                                "fields": [
                                  {
                                    "name": "Aliases:",
                                    "value": aliases
                                  },
                                  {
                                    "name": "Description:",
                                    "value": command.desc
                                  },
                                  {
                                    "name": "Minimum Rank:",
                                    "value": capitalizeFirstLetter(command.minrank)
                                  }
                                ]
                              }})
                            }else{
                              message.channel.send(fEmoji+" **You're not a high enough role to see this command** (requires the *"+command.minrank+"* rank)")
                              .then((msg) => {
                                msg.delete(3000);
                              });
                            }
                          }
                        })
                        .catch(() => {
                          message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                          .then((msg) => {
                            msg.delete(3000);
                          });
                        })
                      }else{
                        message.channel.send(fEmoji+" **Sorry, the required role** (*"+command.minrank+"*) **for this command doesn't exist!**")
                        .then((msg) => {
                          msg.delete(3000);
                        });
                      }
                    }
                  }
                }
              }
          });
        }
      }else{
        message.channel.send("**"+fEmoji+" This command cannot be used in DMs.**")
        .then((msg) => {
          msg.delete(3000);
        });
      }
  });

  addcommand("unmute",[],"This command unmutes a user who was previously muted.","moderator",function(args,message){
    if(message.guild && message.guild === guild){
      message.delete()
      if(args[1]){
        var mentionedmember = getmemberfromid(args[1]);
        if (mentionedmember){
          if(mentionedmember.user !== client.user){
            if (message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0 ) {
              t.get("/1/boards/58d32fc48f3ecced2f524334/lists", function(err, datas) {
                datas.forEach(function(data){
                  if (data.name === "mutes"){
                    hwids = data.id;
                  }
                })
                if(hwids){
                  t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                    cards.forEach(function(card){
                      if (card.name === mentionedmember.user.id){
                        t.del('1/cards/'+card.id,function(err,returns){});
                      }
                    })
                  });
                }else{
                  message.channel.send("**Something seems to be wrong with the mute database, please contact mustardfoot about this issue.**")
                }
              });
              mentionedmember.user.createDM().then((boi) => {
                var good = true;
                boi.send('**You have been unmuted in the server. You may now talk again.**')
              })
              var roles = mentionedmember.roles
              roles.forEach(function(role){
                if (role.name === "muted") {
                  mentionedmember.removeRole(role)
                }
              })
              guild.channels.forEach(function(channel){
                if(channel.name === "logs"){
                  channel.send({"embed": {
                    "description":"Unmute",
                    "timestamp": new Date(),
                    "fields": [
                      {
                        "name": "Staff Member",
                        "value": "<@"+message.author.id+">"
                      },
                      {
                        "name": "User",
                        "value": "<@"+mentionedmember.id+">"
                      }
                    ]
                  }})
                }
              });
              message.channel.send("**"+sEmoji+" <@"+mentionedmember.id+"> has been unmuted.**")
            }else{
              message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
              .then((msg) => {
                msg.delete(3000);
              });
            }
          }
        }else{
          message.channel.send("**"+fEmoji+" This is not a valid user.**")
          .then((msg) => {
            msg.delete(3000);
          });
        }
      }
    }else{
      message.channel.send("**"+fEmoji+" This command cannot be used in DMs.**")
      .then((msg) => {
        msg.delete(3000);
      });
    }
  });

  addcommand("mute",[],"Prevents the specified user from speaking in text and voice channels until they're unmuted or their mute time is up.\n\n**Examples:**\n!mute [user] 50 (mutes for 50 minutes)\n!mute [user] 30s (mutes for 30 seconds)\n!mute [user] 5h (mutes for 5 hours)\n!mute [user] 2d (mutes for 2 days)\n!mute [user] 1w (mutes for 1 week)","moderator",function(args,message){
    if(message.guild && message.guild === guild){
      message.delete()
      if(args[1]){
        var mentionedmember = getmemberfromid(args[1]);
        if (mentionedmember){
          if(mentionedmember.user !== client.user){
            if (message.member && message.member.highestRole.comparePositionTo(mentionedmember.highestRole) > 0 ) {
              var time;
              var displaytime = "forever";
              var reason = "No Reason Provided";
              if(args[2]){
                if(Number(args[2])){
                  time = args[2];
                  if(args[2] !== "1"){
                    displaytime = args[2]+" minutes";
                  }else{
                    displaytime = args[2]+" minute";
                  }
                }else if(Number(args[2].substring(0,args[2].length-1))){
                  if(args[2].substring(args[2].length-1) === "d"){
                    time = Number(args[2].substring(0,args[2].length-1))*1440;
                    if(args[2].substring(0,args[2].length-1) !== "1"){
                      displaytime = args[2].substring(0,args[2].length-1)+" days";
                    }else{
                      displaytime = args[2].substring(0,args[2].length-1)+" day";
                    }
                  }else if(args[2].substring(args[2].length-1) === "m"){
                    time = Number(args[2].substring(0,args[2].length-1));
                    if(args[2].substring(0,args[2].length-1) !== "1"){
                      displaytime = args[2].substring(0,args[2].length-1)+" minutes";
                    }else{
                      displaytime = args[2].substring(0,args[2].length-1)+" minute";
                    }
                  }else if(args[2].substring(args[2].length-1) === "s"){
                    time = Number(args[2].substring(0,args[2].length-1))/60;
                    if(args[2].substring(0,args[2].length-1) !== "1"){
                      displaytime = args[2].substring(0,args[2].length-1)+" seconds";
                    }else{
                      displaytime = args[2].substring(0,args[2].length-1)+" second";
                    }
                  }else if(args[2].substring(args[2].length-1) === "h"){
                    time = Number(args[2].substring(0,args[2].length-1))*60;
                    if(args[2].substring(0,args[2].length-1) !== "1"){
                      displaytime = args[2].substring(0,args[2].length-1)+" hours";
                    }else{
                      displaytime = args[2].substring(0,args[2].length-1)+" hour";
                    }
                  }else if(args[2].substring(args[2].length-1) === "w"){
                    time = Number(args[2].substring(0,args[2].length-1))*10080;
                    if(args[2].substring(0,args[2].length-1) !== "1"){
                      displaytime = args[2].substring(0,args[2].length-1)+" weeks";
                    }else{
                      displaytime = args[2].substring(0,args[2].length-1)+" week";
                    }
                  }
                }
              }
              var adjustment = 0;
              if(!time){
                adjustment = 1;
                time = 0;
              }
              if(args.length > 3){
                reason = "";
                args.forEach(function(arg,n){
                  if(n > 2-adjustment){
                    if(n > 3-adjustment){
                      reason = reason+" "
                    }
                    reason = reason+arg
                  }
                });
              }
              var today = new Date();
              var m = today.getMinutes();
              t.get("/1/boards/58d32fc48f3ecced2f524334/lists", function(err, datas) {
                datas.forEach(function(data){
                  if (data.name === "mutes"){
                    hwids = data.id;
                  }
                })
                if(hwids){
                  t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                    cards.forEach(function(card){
                      if(card.name === mentionedmember.id){
                        t.del('1/cards/'+card.id,function(err,returns){});
                      }
                    })
                    t.post('/1/cards?name='+mentionedmember.id+'&desc='+time+'&pos=top&idList='+hwids,function(err,returns){
                      if(guild.roles.find("name","muted")){
                        var good = true;
                        mentionedmember.addRole(guild.roles.find("name","muted"))
                        .catch(() => {
                          good = false;
                          message.channel.send("**"+fEmoji+" There has been an error giving the user the muted role. Please attempt to re-mute them.**")
                          .then((msg) => {
                            msg.delete(3000);
                          });
                        }).then(() => {
                          mentionedmember.user.createDM().then((boi) => {
                            if(displaytime !== "forever"){
                              boi.send("You have been muted in the server for **"+displaytime+"**. You are unable to speak in text and voice chats until the time is up or a staff member unmutes you.\n\n**Reason:**\n```"+reason+"```")
                            }else{
                              boi.send("You have been muted in the server **forever**. You are unable to speak in text and voice chats unless a staff member unmutes you.\n\n**Reason:**\n```"+reason+"```")
                            }
                          })
                          if(good === true){
                            guild.channels.forEach(function(channel){
                              if(channel.name === "logs"){
                                channel.send({"embed": {
                                  "description":"Mute",
                                  "timestamp": new Date(),
                                  "fields": [
                                    {
                                      "name": "Staff Member",
                                      "value": "<@"+message.author.id+">",
                                      "inline": true
                                    },
                                    {
                                      "name": "Time",
                                      "value": displaytime,
                                      "inline": true
                                    },
                                    {
                                      "name": "User",
                                      "value": "<@"+mentionedmember.id+">"
                                    },
                                    {
                                      "name": "Reason",
                                      "value": reason
                                    }
                                  ]
                                }})
                              }
                            });
                            if(displaytime !== "forever"){
                              message.channel.send(sEmoji+" The user <@"+mentionedmember.id+"> has been muted for **"+displaytime+"**.")
                            }else{
                              message.channel.send(sEmoji+" The user <@"+mentionedmember.id+"> has been muted **forever**.")
                            }
                          }
                        });
                      }else{
                        message.channel.send(fEmoji+" **The muted role doesn't exist. Please contact mustardfoot to fix this.**")
                        .then((msg) => {
                          msg.delete(3000);
                        });
                      }
                    });
                  });
                }else{
                  message.channel.send("**Something seems to be wrong with the mute database, please contact mustardfoot about this issue.**")
                }
              });
            }else{
              message.channel.send("**"+fEmoji+" You are not able to moderate this user.**")
              .then((msg) => {
                msg.delete(3000);
              });
            }
          }else{
            message.channel.send("**"+fEmoji+" You can't mute the bot.**")
            .then((msg) => {
              msg.delete(3000);
            });
          }
        }else{
          message.channel.send("**"+fEmoji+" This is not a valid user.**")
          .then((msg) => {
            msg.delete(3000);
          });
        }
      }
    }else{
      message.channel.send("**"+fEmoji+" This command cannot be used in DMs.**")
      .then((msg) => {
        msg.delete(3000);
      });
    }
  });

  addcommand("verify",[],"This command is used only in the #verify channel and is used to make sure users are not bots and aren't glitched.","",function(args,message){
      if(message.channel.guild && message.channel.name && message.channel.name === "verify"){
        if(message.member){
          var good = true;
          if(guild.roles.find("name","verified")){
            message.member.addRole(message.member.guild.roles.find("name","verified"))
            .catch(() => {
              good = false;
              message.channel.send("**"+fEmoji+" There has been an error verifying you,** <@"+message.author.id+">**. If this problem persists, please rejoin or contact mustardfoot.**")
              .then((msg) => {
                msg.delete(3000);
              });
            }).then(() => {
              if(good === true){
                message.channel.send("**"+sEmoji+" You have been verified,** <@"+message.author.id+">**.**")
              }
            });
          }else{
            message.channel.send(fEmoji+" **The verified role doesn't exist. Please contact mustardfoot to fix this.**")
            .then((msg) => {
              msg.delete(3000);
            });
          }
        }else{
          message.channel.send("**"+fEmoji+" There has been an error verifying you,** <@"+message.author.id+">**. Please rejoin the server.**")
          .then((msg) => {
            msg.delete(3000);
          });
        }
      }
  });

  process.on('unhandledRejection', (err, p) => {
  });

  client.on('ready', () => {
    console.log('hell yeah');
    client.user.setActivity('over the server (prefix is !)', { type: 'WATCHING' })
    .catch(console.error);
  });

  client.on('messageUpdate', (omessage, message) => {
    checkpermit(message,omessage);
  });

  client.on('message', function(message) {
    if(!guild){
      client.guilds.forEach(function(g){
        if(g.id === process.env.SERVER_ID){
          guild = g;
        }
      });
    }
    if (message.author.equals(client.user)) return;
    checkpermit(message);
    var args = message.content.substring(pref.length).split(" ");
    if(message.content.toLowerCase().indexOf('this is so sad') !== -1){
      message.channel.send(':musical_note: **Now playing Despacito.**')
    }
    if(message.content.toLowerCase().indexOf("what's ligma") !== -1 || message.content.toLowerCase().indexOf("what is ligma") !== -1 || message.content.toLowerCase().indexOf("whats ligma") !== -1){
      message.channel.send('ligma balls XD')
    }else if(message.content.toLowerCase().indexOf("what's sugma") !== -1 || message.content.toLowerCase().indexOf("what is sugma") !== -1 || message.content.toLowerCase().indexOf("whats sugma") !== -1){
      message.channel.send('sugma dick XD')
    }else if(message.content.toLowerCase().indexOf("what's updog") !== -1 || message.content.toLowerCase().indexOf("what is updog") !== -1 || message.content.toLowerCase().indexOf("whats updog") !== -1){
      message.channel.send('not much, whats up with you XD')
    }else if(message.content.toLowerCase().indexOf("what's sugondese") !== -1 || message.content.toLowerCase().indexOf("what is sugondese" || message.content.toLowerCase().indexOf("whats sugondese") !== -1) !== -1){
      message.channel.send('sugondese nuts XD')
    }
    if(message.channel.guild && message.channel.name && message.channel.name === "super-secret-cool-thing"){
      var them = guild.members.find(memba => memba.nickname !== null && memba.nickname.toLowerCase() === message.content.toLowerCase())
      if(them){
        if (guild.roles.find("name","knowledgeable")) {
          them.addRole(guild.roles.find("name","knowledgeable"))
          message.channel.send(message.content+" has gained knowledge")
          message.delete()
        }
      }else{
        message.delete()
      }
    }
    if (!message.content.startsWith(pref)) return;
    sEmoji = client.emojis.find("name", "mustardGood").toString()
    fEmoji = client.emojis.find("name", "mustardBad").toString()
    var saidcommand = args[0].toLowerCase()
    var alreadycommanded = false;
    commands.forEach(function(command){
        if(alreadycommanded === false){
          var isalias = false;
          command.aliases.forEach(function(alias){
            if(saidcommand === alias){
              isalias = true;
            }
          });
        	if(command.name === saidcommand || isalias === true){
            if(command.minrank === ""){
              command.does(args,message);
            }else{
              if(guild){
                if(guild.roles.find("name",command.minrank)){
                  guild.fetchMember(message.author).then((theirmember) => {
                    if(!theirmember){
                      message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                      .then((msg) => {
                        msg.delete(3000);
                      });
                    }else{
                      if(theirmember.highestRole.comparePositionTo(guild.roles.find("name",command.minrank)) >= 0){
                        command.does(args,message);
                      }else{
                        message.channel.send(fEmoji+" **You're not a high enough role to run this command** (requires the *"+command.minrank+"* rank)")
                        .then((msg) => {
                          msg.delete(3000);
                        });
                      }
                    }
                  })
                  .catch(() => {
                    message.channel.send(fEmoji+" **Sorry, I can't find you in the server!**")
                    .then((msg) => {
                      msg.delete(3000);
                    });
                  })
                }else{
                  message.channel.send(fEmoji+" **Sorry, the required role** (*"+command.minrank+"*) **for this command doesn't exist!**")
                  .then((msg) => {
                    msg.delete(3000);
                  });
                }
              }
            }
          }
        }
    });
  });

  var myInterval = setInterval(function() {
    t.get("/1/boards/58d32fc48f3ecced2f524334/lists", function(err, datas) {
      var hwids
      var requests
      var requests2
      if(datas){
        datas.forEach(function(data){
          if (data.name === "mutes"){
            hwids = data.id;
          }else if (data.name === "Pending"){
            requests = data.id;
          }else if (data.name === "Accepted"){
            requests2 = data.id;
          }
        })
        if(requests){
          t.get("/1/lists/"+requests+"/cards?fields=id,name,desc",function(err,cards){
            if(cards.length > 0 && cards[0]){
              Noblox.getAuditLog({group:3288652, page:[1,2], action:34})
              .then((results) => {
                results.forEach(function(result){
                  console.log('---')
                  console.log(result.action);
                  console.log(result.action.target);
                  console.log(result.action.params);
                })
                //switch (){}
                var firstcard = cards[0];
                Noblox.getRankInGroup(3288652,firstcard.name)
                .then((ranking) => {
                  if(ranking > 25){
                    console.log(firstcard.name);
                    Noblox.groupPayout({group:3288652,member:firstcard.name,amount:5})
                    .then(() => {
                      t.put('1/cards/'+firstcard.id+'/'+requests2,function(err,returns){});
                    })
                    /*.catch((err) => {
                      console.log(err);
                    });*/
                  }else{
                    t.del('1/cards/'+firstcard.id,function(err,returns){});
                  }
                })
              })
            }
          })
        }
      if(hwids){
        t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
          cards.forEach(function(card){
            t.get('1/cards/'+card.id+'/dateLastActivity',function(err,date){
              if(date){
                var goaltime = new Date(date._value);
                var todaytime = new Date();
                var todaymin = diff_minutes(todaytime,goaltime,card.desc);
                if (todaymin >= 0 && card.desc !== 0 && card.desc !== "0"){
                  var cardname = card.name;
                  var carddesc = card.desc;
                  t.del('1/cards/'+card.id,function(err,returns){});
                  client.fetchUser(cardname).then((thatuser) => {
                    if(thatuser){
                      guild.fetchMember(thatuser).then((muser) => {
                        if(muser){
                          var roles = muser.roles
                          roles.forEach(function(role){
                            if (role.name === "muted") {
                              muser.removeRole(role)
                              muser.createDM().then((boi) => {
                                boi.send('**Your mute time has run out and you have been unmuted in the server. You may now talk again.**')
                              })
                              guild.channels.forEach(function(channel){
                                if(channel.name === "logs"){
                                  channel.send({"embed": {
                                    "description":"Automatic Unmute",
                                    "timestamp": new Date(),
                                    "fields": [
                                      {
                                        "name": "User",
                                        "value": "<@"+muser.id+">"
                                      }
                                    ]
                                  }})
                                }
                              });
                            }
                          })
                        }
                      })
                    }
                  })
                }else{
                  var cardname = card.name;
                  var carddesc = card.desc;
                  client.fetchUser(cardname).then((thatuser) => {
                    if(thatuser && thatuser !== undefined){
                      guild.fetchMember(thatuser).then((muser) => {
                        if(muser && muser !== undefined){
                          if (guild.roles.find("name","muted")) {
                            muser.addRole(guild.roles.find("name","muted"))
                          }
                        }
                      })
                    }
                  })
                }
              }
            });
          })
        });
      }
    }
  });
}, 10000);

  client.login(process.env.BOT_TOKEN);
});
