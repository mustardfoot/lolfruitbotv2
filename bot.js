const Discord = require('discord.js');
var Trello = require("node-trello");
var algebra = require('algebra.js');
var translate = require('yandex-translate')(process.env.translation);
var t = new Trello(process.env.REE,process.env.REE2);
var Fraction = algebra.Fraction;
var Expression = algebra.Expression;
var Equation = algebra.Equation;
const client = new Discord.Client();
var pref = "!";
var lookingfor = false;
var gucciletters = [" ","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","~","`","1","!","2","@","3","#","4","$","5","%","6","^","7","&","8","*","9","(","0",")","-","_","=","+","[","{","]","}",";",":","\'","\"","\\","|",",","<",".",">","/","?"];
var childlockers = {};
var thatid = 364125929624174603;
var jokering = false;
var jokermax = 2500;
var customname = "Joker";
var jokerbattlers = [
];
var jokerhp = 2500;
var jokerchannel = null;
var giveawayers = [

];
var giving = false;
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
function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
function randomnum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function diff_minutes(dt2, dt1, add)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.round(diff-add);

 }

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

function updatejoker(){
 jokerchannel.send({embed: {
       color: 14680064,
       title: customname+" Battle!",
       description: "Spam :punch: in this channel to stop him!!",
       timestamp: new Date(),
       thumbnail: {
        url: "https://static.comicvine.com/uploads/original/11125/111253442/5004137-joker.jpg"
       },
       fields: [{
        name: customname+" HP:",
        value: jokerhp+"/"+jokermax
       }]
      }});
}
function log(title,mod,user,server,reason){
  server.channels.forEach(function(channel){
    if (reason){
    }else{
      reason = "No Reason Given"
    }
    if (channel.name === 'logs' || channel.name === 'Logs'){
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
      },
      {
        "name": "Reason",
        "value": reason,
        "inline": false
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
  if (message.content.indexOf('TROLL') !== -1 && message.author.equals(client.user)){
    message.delete(100)
  }
  if (message.author.equals(client.user) && lookingfor !== false && lookingfor === message.channel.id){
    lookingfor = false;
    message.delete(1000);
  }
  if (message.author.equals(client.user)) return;
  var dothedo = false;
  if (message.content.toLowerCase().indexOf('http') !== -1 || message.content.toLowerCase().indexOf('discord.gg') !== -1){
    var okay = false
    if(message.member){
    var roles = message.member.roles
    roles.forEach(function(role){
     if (role.name === "permit" || role.name === "helpers") {
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
  if (doit === true && dothedo === false){
    var okay = false;
    if(message.member){
    var roles = message.member.roles
    roles.forEach(function(role){
     if (role.name === "permit" || role.name === "helpers") {
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
  if(message.channel.name === "crime-fighting-zone"){
   if(jokering === true){
   var count1 = occurrences(message.content,"👊");
    var wewie = false;
    if (count1 > 0){
     message.delete();
    };
    if (message.author.username.toLowerCase() === "batman"){
     count1 = count1*2;
    };
   jokerbattlers.forEach(function(boom){
    if (boom.id === message.author.id){
     wewie = true;
     boom.punch = boom.punch+count1;
    };
   });
    if(wewie === false){
     jokerbattlers.push({id:message.author.id,punch:count1});
    }
   jokerhp = jokerhp - count1;
   };
   if (jokering === false){
    message.delete();
   }
  };
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
    case "verify" :
      if(message.channel.name === "verify"){
        if(message.member){
          var curname = "";
          var theirname = message.author.username;
          for (var i = 0, len = theirname.length; i < len; i++) {
            var curletter = theirname[i]
            var acceptable =false;
            gucciletters.forEach(function(acceptableletter){
              if (curletter.toLowerCase() === acceptableletter){
                acceptable = true;
              }
            });
            if(acceptable){
              curname = curname+curletter
            }else{
              curname = curname+"?"
            }
          }
          message.member.setNickname(curname).then(() => {
            resolve("Success!");
          });
          message.member.addRole(message.member.guild.roles.find("name","verified"));
          cmdoutput('Success',"You have been verified, <@"+message.author.id+">",message.channel);
        }else{
          cmdoutput('Error',"The bot can't see you're in the server. Please rejoin. (This is a Discord glitch)",message.channel);
        }
      }
    case "setwhitelist" :
      client.guilds.forEach(function(guildy){
        if(guildy.id === process.env.serverId){
          guildy.fetchMember(message.author).then((thatmember) => {
            if (message.author.dmChannel && message.channel === message.author.dmChannel && args[1]){
              var authid = message.author.id;
              var hwids = null;
              var mains = null;
              t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
                datas.forEach(function(data){
                  if (data.name === "HWIDs"){
                    hwids = data.id;
                  }
                })
                datas.forEach(function(data){
                  if (data.name === "mains"){
                    mains = data.id;
                  }
                })
                var isabuyer = false;
                t.get("/1/lists/"+mains+"/cards?fields=id,name,desc",function(err,cards){
                  cards.forEach(function(card){
                    if (card.name === message.author.id){
                      isabuyer = true;
                    }
                  })
                  if(hwids){
                    if(isabuyer === true){
                    t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                      var found = false;
                      cards.forEach(function(card){
                        if (card.desc === authid){
                          found = true;
                          cmdoutput('Error',"You're already whitelisted! Please run the command !removewhitelist if you want to change it.",message.channel);
                        }
                      })
                      if(found === false){
                        cmdoutput("Success","You have been whitelisted for Grab Knife V4!",message.channel);
                        t.post('/1/cards?name='+args[1]+'&desc='+authid+'&pos=top&idList='+hwids,function(err,returns){
                          if(err){
                            console.log(err);
                          }
                        });
                      }
                    });
                  }else{
                    cmdoutput("Error","You aren't a buyer.",message.channel);
                  }
                  }else{
                    cmdoutput("Error","Something seems to be wrong with the HWID list! Please contact mustardfoot and tell him.",message.channel);
                  }
                })
              });
            }
          });
          }
        });
      break;
      case "setchildlock" :
        client.guilds.forEach(function(guildy){
          if(guildy.id === process.env.serverId){
            guildy.fetchMember(message.author).then((thatmember) => {
              if (message.author.dmChannel && message.channel === message.author.dmChannel){
                var authid = message.author.id;
                var hwids = null;
                var mains = null;
                t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
                  datas.forEach(function(data){
                    if (data.name === "childlocks"){
                      hwids = data.id;
                    }
                  })
                  datas.forEach(function(data){
                    if (data.name === "mains"){
                      mains = data.id;
                    }
                  })
                  var isabuyer = false;
                  t.get("/1/lists/"+mains+"/cards?fields=id,name,desc",function(err,cards){
                    cards.forEach(function(card){
                      if (card.name === message.author.id){
                        isabuyer = true;
                      }
                    })
                    if(hwids){
                      if(isabuyer === true){
                      t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                        var found = false;
                        cards.forEach(function(card){
                          if (card.name === authid){
                            found = true;
                            cmdoutput('Error',"You've already proven you're not in middle school!",message.channel);
                          }
                        })
                        if(found === false){
                          var num1 = randomnum(1,100);
                          var num2 = randomnum(1,100);
                          var num3 = randomnum(1,100);
                          var num4 = randomnum(1,100);
                          var num5 = randomnum(1,100);
                          var x = new Expression("x");
                          var eq3 = new Equation(x.divide(num1).multiply(num2).subtract(num5), new Fraction(num3, num4));
                          cmdoutput(eq3.toString(),"To get rid of the childlock, please respond with !answer [answer to this equation rounded to the nearest tenth]\n\n[answer should have no spaces, be in the form of x=[num], and x is rounded to the nearest tenth.]",message.channel);
                          var answer = eq3.solveFor("x");
                          var rounded = Math.round10(answer,-1);
                          var roundedanswer = "x="+rounded.toString();
                          childlockers[authid] = roundedanswer;
                        }
                      });
                    }else{
                      cmdoutput("Error","You aren't a buyer.",message.channel);
                    }
                    }else{
                      cmdoutput("Error","Something seems to be wrong with the HWID list! Please contact mustardfoot and tell him.",message.channel);
                    }
                  })
                });
              }
            });
            }
          });
        break;
    case "answer" :
    client.guilds.forEach(function(guildy){
      if(guildy.id === process.env.serverId){
        guildy.fetchMember(message.author).then((thatmember) => {
          if (message.author.dmChannel && message.channel === message.author.dmChannel && args[1]){
            var authid = message.author.id;
            var hwids = null;
            var mains = null;
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "childlocks"){
                  hwids = data.id;
                }
              })
              datas.forEach(function(data){
                if (data.name === "mains"){
                  mains = data.id;
                }
              })
              var isabuyer = false;
              t.get("/1/lists/"+mains+"/cards?fields=id,name,desc",function(err,cards){
                cards.forEach(function(card){
                  if (card.name === message.author.id){
                    isabuyer = true;
                  }
                })
                if(hwids){
                  if(isabuyer === true){
                  t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                    var found = false;
                    cards.forEach(function(card){
                      if (card.name === authid){
                        found = true;
                        cmdoutput('Error',"You've already proven you're not in middle school!",message.channel);
                      }
                    })
                    if(found === false){
                      if (childlockers[authid]){
                        if(childlockers[authid] === args[1]){
                          cmdoutput('Success!','Congratulations! You have disabled childlock.',message.channel);
                          t.post('/1/cards?name='+authid+'&pos=top&idList='+hwids,function(err,returns){
                            if(err){
                              console.log(err);
                            }
                          });
                        }else{
                          cmdoutput('Error',"Incorrect answer. Are you sure you've rounded to the nearest tenth and put it in the form of \"x=9001\"?",message.channel);
                        }
                      }else{
                        cmdoutput('Error','Please run the command \"!setchildlock\" to start.',message.channel);
                      }
                    }
                  });
                }else{
                  cmdoutput("Error","You aren't a buyer.",message.channel);
                }
                }else{
                  cmdoutput("Error","Something seems to be wrong with the HWID list! Please contact mustardfoot and tell him.",message.channel);
                }
              })
            });
          }
        });
        }
      });
      break;
    case "removewhitelist" :
        var isabuyer = false;
        client.guilds.forEach(function(guildy){
          if(guildy.id === process.env.serverId){
            guildy.fetchMember(message.author).then((thatmember) => {
              thatmember.roles.forEach(function(rolelol){
                if(rolelol.name === "buyers"){
                  isabuyer = true;
                }
              })
              if (message.author.dmChannel && message.channel === message.author.dmChannel && isabuyer === true){
                var authid = message.author.id;
                var hwids = null;
                t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
                  datas.forEach(function(data){
                    if (data.name === "HWIDs"){
                      hwids = data.id;
                    }
                  })
                  if(hwids){
                    t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                      var found = false;
                      cards.forEach(function(card){
                        if (card.desc === authid){
                          found = card.id;
                        }
                      })
                      if(found !== false){
                        cmdoutput("Success","Your HWID has been removed, please go on your main account and use the script to get your new one.",message.channel);
                        t.del('1/cards/'+found,function(err,returns){
                          if(err){
                            console.log(err);
                          }
                        });
                      }else{
                        cmdoutput("Error","You're not whitelisted! Please run the command !setwhitelist [HWID] to set one up.",message.channel)
                      }
                    });
                  }else{
                    cmdoutput("Error","Something seems to be wrong with the HWID list! Please contact mustardfoot and tell him!",message.channel)
                  }
                });
              }
            });
            }
          });
        break;
    case "8ball" :
      if(message.channel.name === "bot-chat"){
       var outcum = "There has been an error, Sorry! Please try again"
       if (args[1]) outcum = fortunes[Math.floor(Math.random()*fortunes.length)];
       cmdoutput('8Ball',outcum + ", <@" + message.author.id + ">",message.channel)
      };
      break;
    case "giveaway" :
      if (message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0 && giving === false){
      giveawayers = [

      ];
      giving = true;
      cmdoutput('Giveaway',"Giveaway started! Say \"!entergiveaway\" to enter!",message.channel)
      }
      break;
    case "crime" :
      if (message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0 && jokering === false){
       message.guild.channels.forEach(function(channel){
        if(channel.name === "crime-fighting-zone"){
         jokerchannel = channel;
        }
       })
       jokermax = 2500;
       jokerbattlers = [
       ];
      customname = "Joker";
      var curnum = 1;
      args.forEach(function(role){
        if(curnum > 2){
          if(curnum === 3){
            customname = role;
          }else{
            customname = customname+" "+role;
          }
        }
        curnum = curnum+1;
      })
       if (args[1] && parseInt(args[1])){
        jokermax = parseInt(args[1])
       }
       jokerhp = jokermax;
       jokering = true;
       updatejoker()
      }
      break;
    case "entergiveaway" :
      if (giving === true){
       var noe = false;
       giveawayers.forEach(function(aaa){
        if (aaa === message.author.id) {
         noe = true;
        };
       })
       if (noe === false){
        giveawayers.push(message.author.id);
        cmdoutput('Giveaway',"Congratulations, <@"+message.author.id+">, you have entered the giveaway!",message.channel)
       };
      }
      break;
    case "closegiveaway" :
     if (message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0 && giving === true){
      giving = false;
      var amnt = giveawayers.length
      var hmm = randomnum(0,amnt)
      var ree = giveawayers[hmm];
      cmdoutput('Giveaway',"Congratulations, <@"+ree+">, you have won the giveaway!",message.channel)
     }
     break;
    case "redraw" :
    if (message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0) {
      var amnt = giveawayers.length
      var hmm = randomnum(0,amnt)
      var ree = giveawayers[hmm];
      cmdoutput('Giveaway',"Congratulations, <@"+ree+">, you have won the giveaway!",message.channel)
     }
     break;
     case "fixname" :
       if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0){
         var userlist = message.mentions.members;
         userlist.forEach(function(user){
           var curname = "";
           var theirname = user.user.username;
           for (var i = 0, len = theirname.length; i < len; i++) {
             var curletter = theirname[i]
             var acceptable =false;
             gucciletters.forEach(function(acceptableletter){
               if (curletter.toLowerCase() === acceptableletter){
                 acceptable = true;
               }
             });
             if(acceptable){
               curname = curname+curletter
             }else{
               curname = curname+"?"
             }
           }
           user.setNickname(curname).then(() => {
             cmdoutput('FixName',"<@"+user.id+">'s name has been fixed to exclude special characters.",message.channel);
             resolve("Success!");
           });
         })
       }
       break;
    case "permit" :
      if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0){
        var userlist = message.mentions.members;
        userlist.forEach(function(user){
          user.addRole(message.member.guild.roles.find("name","permit"));
          cmdoutput('Permit',"<@"+user.id+"> has been permitted to post a link, image, or file.",message.channel);
        })
      }
      break;
    case "revokepermit" :
      if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0){
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
    case "makehelper" :
      if (message.member && args[1] && message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","administrators")) >= 0){
        var userlist = message.mentions.members;
        userlist.forEach(function(user){
          cmdoutput('Success',"<@"+user.id+"> has become a helper.",message.channel);
          log('MakeHelper',"<@"+message.author.id+">","<@"+user.id+">",message.channel.guild)
          user.addRole(message.member.guild.roles.find("name","helpers"));
        })
      }
      break;
      case "removehelper" :
      if (message.member && args[1] && message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","administrators")) >= 0){
        var userlist = message.mentions.members;
        userlist.forEach(function(user){
          cmdoutput('Success',"<@"+user.id+"> has been removed from the helper position.",message.channel);
          log('RemoveHelper',"<@"+message.author.id+">","<@"+user.id+">",message.channel.guild)
          user.removeRole(message.member.guild.roles.find("name","helpers"));
        })
      }
      break;
    case "rerole" :
    if (message.member && args[1] && message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0){
      var userlist = message.mentions.members; // Saving userlist to a variable
      userlist.forEach(function(user){
        var hwids = null;
        var authid = user.id;
        t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
          datas.forEach(function(data){
            if (data.name === "mains"){
              hwids = data.id;
            }
          })
          if(hwids){
            t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
              var found = false;
              cards.forEach(function(card){
                if (card.name === authid){
                  found = true;
                  cmdoutput('Whitelist',"<@"+user.id+"> has been re-roled for Grab Knife V4.",message.channel);
                  user.addRole(message.member.guild.roles.find("name","buyers"));
                }
              })
              if(found === false){
                cmdoutput('Error',"<@"+user.id+"> is not whitelisted for Grab Knife V4.",message.channel);
              }
            });
          }else{
            cmdoutput("Error","Something seems to be wrong with the buyers list! Please contact mustardfoot and tell him.",message.channel);
          }
        });
      })
    }
    break;
    case "whitelist" :
      if (message.member && args[1] && message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0){
        var userlist = message.mentions.members; // Saving userlist to a variable
        userlist.forEach(function(user){
          user.addRole(message.member.guild.roles.find("name","buyers"));
          var hwids = null;
          var authid = user.id;
          t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
            datas.forEach(function(data){
              if (data.name === "mains"){
                hwids = data.id;
              }
            })
            if(hwids){
              t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                var found = false;
                cards.forEach(function(card){
                  if (card.name === authid){
                    found = true;
                    cmdoutput('Error',"This user is already whitelisted.",message.channel);
                  }
                })
                if(found === false){
                  cmdoutput('Whitelist',"<@"+user.id+"> has been whitelisted for Grab Knife V4.",message.channel);
                  user.user.createDM().then((boi) => {
                  cmdoutput('Whitelist',"You have been whitelisted for Grab Knife V4, you may now use the script found in <#385857421496811521>.",boi);
                  });
                  t.post('/1/cards?name='+authid+'&pos=top&idList='+hwids,function(err,returns){
                    if(err){
                      console.log(err);
                    }
                  });
                }
              });
            }else{
              cmdoutput("Error","Something seems to be wrong with the buyers list! Please contact mustardfoot and tell him.",message.channel);
            }
          });
          var hwids2 = null;
          t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
            datas.forEach(function(data){
              if (data.name === "blacklists"){
                hwids2 = data.id;
              }
            })
            if(hwids2){
              t.get("/1/lists/"+hwids2+"/cards?fields=id,name,desc",function(err,cards){
                var found = false;
                cards.forEach(function(card){
                  if (card.desc === authid){
                    found = card.id;
                  }
                })
                if(found !== false){
                  t.del('1/cards/'+found,function(err,returns){
                    if(err){
                      console.log(err);
                    }
                  });
                }
              });
            }else{
              cmdoutput("Error","Something seems to be wrong with the buyers list! Please contact mustardfoot and tell him.",message.channel);
            }
          });
        })
      }
      break;
    case "blacklist" :
        if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0){
          var userlist = message.mentions.users; // Saving userlist to a variable
          var authid = null;
          var user = null;
          if(args[1]){
            authid = args[1].substring(2,args[1].length - 1);
          }
          userlist.forEach(function(usereck){
            user = usereck;
            authid = user.id;
          })
            var hwids = null;
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "HWIDs"){
                  hwids = data.id;
                }
              })
              if(hwids){
                t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                  var found = false;
                  var thatname = null;
                  var thatdesc = null;
                  cards.forEach(function(card){
                    if (card.desc === authid){
                      found = card.id;
                      thatname = card.name;
                      thatdesc = card.desc;
                    }
                  })
                  if(found !== false){
                    t.del('1/cards/'+found,function(err,returns){
                      if(err){
                        console.log(err);
                      }
                    });
                    t.post('/1/cards?name='+thatname+'&desc='+thatdesc+'&pos=top&idList=5a0249f89ccaa94b672df1f5',function(err,returns){
                      if(err){
                        console.log(err);
                      }
                    });
                  }
                });
              }else{
                cmdoutput("Error","Something seems to be wrong with the user list!",message.channel)
              }
              hwids = null;
              t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
                datas.forEach(function(data){
                  if (data.name === "mains"){
                    hwids = data.id;
                  }
                })
                if(hwids){
                  t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                    var found = false;
                    cards.forEach(function(card){
                      if (card.name === authid){
                        found = card.id;
                      }
                    })
                    if(found !== false){
                      t.del('1/cards/'+found,function(err,returns){
                        if(err){
                          console.log(err);
                        }
                      });
                    }
                  });
                }else{
                  cmdoutput("Error","Something seems to be wrong with the user list!",message.channel)
                }
              });
            });
            cmdoutput('Blacklist',"<@"+authid+"> has been blacklisted from Grab Knife V4.",message.channel);
            if(user){
            message.channel.guild.fetchMember(user).then((useree) => {
              useree.removeRole(message.member.guild.roles.find("name","buyers"));
              useree.addRole(message.member.guild.roles.find("name","blacklisted"));
            });
            }
        }
        break;
        case "removewhitelist" :
            if (message.member && args[1] && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","creators")) >= 0){
              var userlist = message.mentions.users; // Saving userlist to a variable
              var authid = null;
              var user = null;
              if(args[1]){
                authid = args[1].substring(2,args[1].length - 1);
              }
              userlist.forEach(function(usereck){
                user = usereck;
                authid = user.id;
              })
                var hwids = null;
                t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
                  datas.forEach(function(data){
                    if (data.name === "HWIDs"){
                      hwids = data.id;
                    }
                  })
                  if(hwids){
                    t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                      var found = false;
                      var thatname = null;
                      var thatdesc = null;
                      cards.forEach(function(card){
                        if (card.desc === authid){
                          found = card.id;
                          thatname = card.name;
                          thatdesc = card.desc;
                        }
                      })
                      if(found !== false){
                        t.del('1/cards/'+found,function(err,returns){
                          if(err){
                            console.log(err);
                          }
                        });
                    });
                  }else{
                    cmdoutput("Error","Something seems to be wrong with the user list!",message.channel)
                  }
                  hwids = null;
                  t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
                    datas.forEach(function(data){
                      if (data.name === "mains"){
                        hwids = data.id;
                      }
                    })
                    if(hwids){
                      t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                        var found = false;
                        cards.forEach(function(card){
                          if (card.name === authid){
                            found = card.id;
                          }
                        })
                        if(found !== false){
                          t.del('1/cards/'+found,function(err,returns){
                            if(err){
                              console.log(err);
                            }
                          });
                        }
                      });
                    }else{
                      cmdoutput("Error","Something seems to be wrong with the user list!",message.channel)
                    }
                  });
                });
                cmdoutput('Blacklist',"<@"+authid+">'s whitelist has been removed.",message.channel);
                if(user){
                message.channel.guild.fetchMember(user).then((useree) => {
                  useree.removeRole(message.member.guild.roles.find("name","buyers"));
                });
                }
            }
            break;
    case "purge" :
      if (message.member && args[1] && parseInt(args[1]) && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0){
      var ree = parseInt(args[1]);
      var channel = message.channel;
      for(x = 0; x < Math.ceil((ree-1)/200); x = x + 1) {
          if (ree <= 99){
          channel.bulkDelete(parseInt(args[1])+1);
          }else{
          channel.bulkDelete(100);
          ree = ree-100
          }
        }
      lookingfor = channel.id;
      log('Purge | Amount: '+args[1],"<@"+message.author.id+">","<#"+channel.id+">",channel.guild)
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
      var userlist = message.mentions.members;
      var muser = null;
      var curnum = 0;
      userlist.forEach(function(thatoneguythatgotmentioned){
        if(muser === null){
          muser = thatoneguythatgotmentioned;
        }
      });
      var reason = "No Reason Provided";
      args.forEach(function(role){
        if(curnum > 2){
          if(curnum === 3){
            reason = role;
          }else{
            reason = reason+" "+role;
          }
        }
        curnum = curnum+1;
      })
      if (muser){
        if (message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0 && message.member.highestRole.comparePositionTo(muser.highestRole) > 0 ) {
          if (message.member.guild.roles.find("name","Muted") || message.member.guild.roles.find("name","muted")) {
          if (message.member.guild.roles.find("name","Muted")) {
           muser.addRole(message.member.guild.roles.find("name","Muted"))
          }
          if (message.member.guild.roles.find("name","muted")) {
           muser.addRole(message.member.guild.roles.find("name","muted"))
          }
          var today = new Date();
          var m = today.getMinutes();
          if (parseInt(args[2]) && parseInt(args[2]) !== 0) {
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "mutes"){
                  hwids = data.id;
                }
              })
              if(hwids){
                t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                  cards.forEach(function(card){
                    if(card.name === muser.id){
                      t.del('1/cards/'+card.id,function(err,returns){
                        if(err){
                          console.log(err);
                        }
                      });
                    }
                  })
                  t.post('/1/cards?name='+muser.id+'&desc='+args[2]+'&pos=top&idList='+hwids,function(err,returns){
                    if(err){
                      console.log(err);
                    }
                  });
                });
              }else{
                cmdoutput("Error","Something seems to be wrong with the mute database, automatic unmute will not work.",message.channel)
              }
          });
          }
          var time = "Forever"
          if (args && parseInt(args[2])){
          time = parseInt(args[2])+" Minutes";
          }
          cmdoutput("Mute | "+time,"<@"+muser.id+"> has been muted for \""+reason+"\"",message.channel)
          log('Mute | '+time,"<@"+message.author.id+">","<@"+muser.id+">",message.channel.guild,reason)
            } else {
            cmdoutput("Error","Failed to find muted role.",message.channel)
          }
        }
      }
      break;
      case "unmute" :
        var userlist = message.mentions.members; // Saving userlist to a variable
        userlist.forEach(function(user){
          if (message.member && message.member.highestRole.comparePositionTo(message.member.guild.roles.find("name","helpers")) >= 0 && message.member.highestRole.comparePositionTo(user.highestRole) > 0 ) {
            user.user.createDM().then((boi) => {
              cmdoutput('Unmute',"You have been unmuted in the Grab Knife V4 server.",boi);
            });
            t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
              datas.forEach(function(data){
                if (data.name === "mutes"){
                  hwids = data.id;
                }
              })
              if(hwids){
                t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
                  cards.forEach(function(card){
                    if (card.name === user.id){
                      t.del('1/cards/'+card.id,function(err,returns){
                        if(err){
                          console.log(err);
                        }
                      });
                    }
                  })
                });
              }else{
                cmdoutput("Error","Something seems to be wrong with the mutes list! Please contact mustardfoot and tell him!",message.channel)
              }
            });
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
 }
 finally {
 }
});

var myInterval = setInterval(function() {
  t.get("/1/boards/5979179aba4cd1de66a4ea5b/lists", function(err, datas) {
    datas.forEach(function(data){
      if (data.name === "mutes"){
        hwids = data.id;
      }
    })
    if(hwids){
      t.get("/1/lists/"+hwids+"/cards?fields=id,name,desc",function(err,cards){
        cards.forEach(function(card){
          t.get('1/cards/'+card.id+'/dateLastActivity',function(err,date){
            var goaltime = new Date(date._value);
            var todaytime = new Date();
            var todaymin = diff_minutes(todaytime,goaltime,card.desc);
            if (todaymin >= 0){
              var cardname = card.name;
              var carddesc = card.desc;
              t.del('1/cards/'+card.id,function(err,returns){
                if(err){
                }
              });
              client.fetchUser(cardname).then((thatuser) => {
                client.guilds.forEach(function(guildy){
                  if(guildy.id === process.env.serverId){
                    guildy.fetchMember(thatuser).then((muser) => {
                      var roles = muser.roles
                      roles.forEach(function(role){
                        if (role.name === "muted" || role.name === "Muted") {
                          muser.removeRole(role)
                          thatuser.createDM().then((boi) => {
                            cmdoutput('Unmute',"You have been unmuted in the Grab Knife V4 server.",boi);
                          });
                          log('Automatic Unmute | '+carddesc+" Minutes","knife Bot","<@"+muser.id+">",guildy)
                        }
                      })
                    })
                  }
                })
              })
            }
          });
        })
      });
    }else{
      cmdoutput("Error","Something seems to be wrong with the mute database, automatic unmute will not work.",message.channel)
    }
});
    if(jokering === true){
     if(jokerhp <= 0){
      jokerbattlers.sort(function(a, b){return b.punch - a.punch});
      jokering = false
      var place = "Nobody";
      var place2 = "Nobody";
      var place3 = "Nobody";
      var place4 = "Nobody";
      var place5 = "Nobody";
      if (jokerbattlers[1] && jokerbattlers[0].id){
       place = "<@"+jokerbattlers[0].id+"> with "+jokerbattlers[0].punch+" punches";
      };
      if (jokerbattlers[1] && jokerbattlers[1].id){
       place2 = "<@"+jokerbattlers[1].id+"> with "+jokerbattlers[1].punch+" punches";
      };
      if (jokerbattlers[2] && jokerbattlers[2].id){
       place3 = "<@"+jokerbattlers[2].id+"> with "+jokerbattlers[2].punch+" punches";
      };
      if (jokerbattlers[3] && jokerbattlers[3].id){
       place4 = "<@"+jokerbattlers[3].id+"> with "+jokerbattlers[3].punch+" punches";
      };
      if (jokerbattlers[4] && jokerbattlers[4].id){
       place5 = "<@"+jokerbattlers[4].id+"> with "+jokerbattlers[4].punch+" punches";
      };
      jokerchannel.bulkDelete(100);
      jokerchannel.send({embed: {
       color: 14680064,
       title: customname+" Battle!",
       description: "The "+customname+" has been defeated! (you might have to press ctrl+R if some of your punches are still there, discord bug)",
       thumbnail: {
        url: "https://i.pinimg.com/736x/86/22/ae/8622ae3e39fbb2b2ebf9afa6b12befa5--dc-comic-comic-art.jpg"
       },
       "fields": [
      {
        "name": ":trophy: 1st Place:",
        "value": place,
        "inline": false
      },
      {
        "name": "2nd Place",
        "value": place2,
        "inline": false
      },
      {
        "name": "3rd Place",
        "value": place3,
        "inline": false
      },
      {
        "name": "4th Place:",
        "value": place4,
        "inline": false
      },
      {
        "name": "5th Place:",
        "value": place5,
        "inline": false
      }
    ],
       timestamp: new Date()
      }});
     }else{
      jokerchannel.bulkDelete(100);
      updatejoker()
     }
    }
}, 10000);

client.login(process.env.BOT_TOKEN);
