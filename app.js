const restify = require('restify');
const builder = require('botbuilder');
const weather = require('./weather');
const botWork = require('./bot-work-repo');

const server = restify.createServer();

// using plugin của restify 
//http://restify.com/docs/plugins-api/#queryparser
server.use(restify.plugins.queryParser());

server.listen(process.env.port || process.env.PORT || 56789, function () {
  console.log('%s listening to %s', server.name, server.url);
});

const connector = new builder.ChatConnector({
  appId: '5d40f369-ac75-4d56-986d-3a6dd43bbbeb',
  appPassword: 'wnwMNYN039$mksaVDA70_%]'
});

const inMemoryStorage = new builder.MemoryBotStorage();

const bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage); // Register in memory storage;

// ---- Handle user action ----
bot.on('contactRelationUpdate', function (message) {
  if (message.action === 'add') {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
      .address(message.address)
      .text("Xin chào %s... Cảm ơn vì đã kết bạn với với tôi. Hô lê (mooning)  ...", name || 'there');
    bot.send(reply);
  }
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

server.get('/', function (req, res, next) {
  res.send('Chào mừng bạn đến với bot của Thắng Ngô :v');
});

// demo về next function
server.get('/hello', function (req, res, next) {
  req.cache = 'a';
  next();
  // res.send('Hello World');
}, function (req, res, next) {
  if (req.cache) {
    res.send('cache');
  }
  else {
    res.send('not cache');
  }
});

server.get('/sendMessage', function (req, res, next) {
  if(req.query.conversationId != undefined){
    var address = {
      channelId: 'skype',
      serviceUrl: 'https://smba.trafficmanager.net/apis/',
      conversation:{  
        id: req.query.conversationId
     }
    };
    bot.send(new builder.Message()
    .text(req.query.message)
    .address(address));  
    // res.status(200).json({'message':'Đã gửi message ạ :v'});
    res.json({'message':'Đã gửi message ạ :v'});
  }else{
    // res.send('Vui lòng điền conversationId');
    // res.status(200).json({'message':'Vui lòng điền conversationId'});
  }
});

server.get('/sql', function(req, res, next){
  botWork.insertWork();
  res.send('ok');
});

server.get('/weather', function (req, res, next) {
  weather.getWeather()
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      next(error);
    });
});



String.prototype.contains = function (content) {
  return this.indexOf(content) !== -1;
}

bot.dialog('/', function (session) {
  // console.log(session.message.address);
  // var resMess = new builder.Message();
  var mess = session.message.text.toLowerCase().trim();

  if (mess.indexOf('getid') > -1) {
    bot.send(new builder.Message()
      .text('Your Skype Id: ' + session.message.address.conversation.id)
      .address(session.message.address));
  }
  else if (mess == 'hi' || mess == 'hello') {
    bot.send(new builder.Message()
      .text('Xéo (mooning)')
      .address(session.message.address));
  }
  else if (mess == 'a') {
    session.beginDialog('bot-work');
  }
  else if (mess.indexOf('thời tiết') > -1 || mess.indexOf('weather') > -1) {
    weather.getWeather()
      .then(function (data) {
        bot.send(new builder.Message().address(session.message.address).text(data));
      })
      .catch(function (error) {
        next(error);
        bot.send(new builder.Message()
          .text(error.message)
          .address(session.message.address));
      });
  }
  else {
    // bot.send(resMess.address(session.message.address).text('Chúng ta không thuộc về nhau !!!'));
    bot.send(new builder.Message()
      .text('Tao không hiểu ý này của mày...!!!')
      .address(session.message.address));
  }
});

// bot.dialog('bot-work', [
//   function(session){
//     session.beginDialog('bot-work-dialog');
//   },
//   function(session, results){    
//     session.endDialog(`Hello ${results.response.entity}!`);
//   }
// ]);

// bot.dialog('bot-work-dialog', [
//   function (session, args, next) {
//     var botWorkChoises = [
//       "Tạo việc mới cho BOT nhắc :v \n",
//       "Hiển thị tất cả công việc đang có ra :v \n"
//     ];
//     builder.Prompts.choice(session, "Bạn muốn làm gì với chức năng nhắc việc của BOT :v? \n", botWorkChoises, { listStyle: builder.ListStyle.button });
//   }
// ]);


// bot.dialog('greetings', [
//   function (session) {
//     session.beginDialog('ensureProfile');
//   },
//   function (session, results) {    
//     session.endDialog(`Hello ${results.response.name}!`);
//   }
// ]);

// bot.dialog('ensureProfile', [
//   function (session, args, next) {
//     session.dialogData.profile = args || {}; // Set the profile or create the object.
//     if (!session.dialogData.profile.name) {
//       builder.Prompts.text(session, "What's your name?");
//     } else {
//       next(); // Skip if we already have this info.
//     }
//   },
//   function (session, results, next) { 
//     var salesData = {
//       "west": {
//           units: 200,
//           total: "$6,000"
//       },
//       "central": {
//           units: 100,
//           total: "$3,000"
//       },
//       "east": {
//           units: 300,
//           total: "$9,000"
//       }
//   };
//     builder.Prompts.choice(session, "Which region would you like sales for?", salesData, { listStyle: builder.ListStyle.button });
//   },
//   function (session, results, next) {
//     if (results.response) {
//       // Save user's name if we asked for it.
//       session.dialogData.profile.name = results.response;
//     }
//     if (!session.dialogData.profile.company) {
//       builder.Prompts.text(session, "What company do you work for?");
//     } else {
//       next(); // Skip if we already have this info.
//     }
//   },
//   function (session, results) {
//     if (results.response) {
//       // Save company name if we asked for it.
//       session.dialogData.profile.company = results.response;
//     }
//     session.endDialogWithResult({ response: session.dialogData.profile });
//   }
// ]);


// Example cho cái next
server.use(function (error, req, res, next) {
  console.log(error);
  res.statusCode(500);
  res.send(error.message);
});