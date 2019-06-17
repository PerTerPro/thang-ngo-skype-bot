var restify = require('restify');
var builder = require('botbuilder');
var weather = require('./weather');

var server = restify.createServer();

// using plugin của restify 
//http://restify.com/docs/plugins-api/#queryparser
server.use(restify.plugins.queryParser());

server.listen(process.env.port || process.env.PORT || 56789, function () {
  console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
  appId: '5d40f369-ac75-4d56-986d-3a6dd43bbbeb',
  appPassword: 'wnwMNYN039$mksaVDA70_%]'
});

var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage); // Register in memory storage;

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

server.get('/weather', function (req, res, next) {
  weather.getWeather()
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      next(error);
    });
});

bot.on('contactRelationUpdate', function (message) {
  if (message.action === 'add') {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
      .address(message.address)
      .text("Xin chào %s... Cảm ơn vì đã kết bạn với với tôi. Hô lê (mooning)  ...", name || 'there');
    bot.send(reply);
  }
});

String.prototype.contains = function (content) {
  return this.indexOf(content) !== -1;
}

bot.dialog('/', function (session) {
  // console.log(session.message.address);
  // var resMess = new builder.Message();
  var mess = session.message.text.toLowerCase();

  if (mess.indexOf('getid') > -1) {
    bot.send(new builder.Message()
      .text('Your Skype Id: ' + session.message.address.conversation.id)
      .address(session.message.address));
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
      .text('Chúng ta không thuộc về nhau !!!')
      .address(session.message.address));
  }
});


// Example cho cái next
server.use(function (error, req, res, next) {
  console.log(error);
  res.statusCode(500);
  res.send(error.message);
});