var restify = require('restify');
var builder = require('botbuilder');
var dt = require('./myfirstmodule');

var server = restify.createServer();

// using plugin của restify 
//http://restify.com/docs/plugins-api/#queryparser
server.use(restify.plugins.queryParser());    

server.listen(process.env.port || process.env.PORT, function () {
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
server.get('/hello', function (req, res, next) {
  res.send('Hello World');
});

server.get('/getDate', function (req, res, next) {
  res.send(dt.myDateTime());
})

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
  console.log(session.message.address);
  if (session.message.text.indexOf('getid') > -1) {
    bot.send(new builder.Message()
      .text('Your Skype Id: ' + session.message.address.conversation.id)
      .address(session.message.address));
  } else {
    bot.send(new builder.Message()
      .text('Chúng ta không thuộc về nhau !!!')
      .address(session.message.address));
  }
});