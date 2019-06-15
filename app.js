var restify = require('restify');  
var builder = require('botbuilder');

var server = restify.createServer();  
server.listen(process.env.port || process.env.PORT || 8080, function () {  
  console.log('%s listening to %s', server.name, server.url);
});


var connector = new builder.ChatConnector({  
  appId: '5d40f369-ac75-4d56-986d-3a6dd43bbbeb',
  appPassword: 'wnwMNYN039$mksaVDA70_%]'
});

var bot = new builder.UniversalBot(connector);

// Listen for messages from users
server.post('/api/messages', connector.listen());
server.get('/hello', function(req, res, next){
  res.send('Hello World');
});

bot.on('contactRelationUpdate', function (message) {  
  if (message.action === 'add') {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
      .address(message.address)
      .text("Xin chào %s... Cảm ơn vì đã kết bạn với với tôi. Moa moa ...", name || 'there');
    bot.send(reply);
  }
});

String.prototype.contains = function (content) {  
  return this.indexOf(content) !== -1;
}

bot.dialog('/', function (session) {    
  if (session.message.text.indexOf('Haposoft') !== -1) {
    bot.send(new builder.Message()
      .text('Đừng rời xa tôi, vì tôi lỡ yêu người mất rồi !')
      .address(session.message.address));
  } else {
    bot.send(new builder.Message()
      .text('Chúng ta không thuộc về nhau !!!')
      .address(session.message.address));
  }
});