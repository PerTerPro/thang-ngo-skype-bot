var mongoose = require('mongoose');
const moment = require('moment');
const url = process.env.ConnectionString || 'mongodb+srv://perterpro:hahahihi@thang-ngo-bot-scidd.mongodb.net/bot-database?retryWrites=true&w=majority';
const collection = 'conversation';

mongoose.connect(url, { useNewUrlParser: true });
//  const client = new mongoose.connect(url, { useNewUrlParser: true });

//Ép Mongoose sử dụng thư viện promise toàn cục
mongoose.Promise = global.Promise;

//Lấy kết nối mặc định
var db = mongoose.connection;

var conversationModel = require('./conversation-model');
var schema = conversationModel.conversationModel();
var Conversation = mongoose.model(collection, schema);


//Ràng buộc kết nối với sự kiện lỗi (để lấy ra thông báo khi có lỗi)
db.on('error', function () {
    console.error('MongoDB connection error:');
});

exports.findConversationWithConversationId = function (conversationId) {
    var query = {
        conversationId: conversationId
    }
    return Conversation.findOne(query);
}

exports.addConversation = function (conversationId) {
    exports.findConversationWithConversationId(conversationId).then(function (result) {
        if (result == null) {
            var conversation = {
                id: moment().format('YYYYMMDDHHmmss'),
                conversationId: conversationId
            }
            return Conversation.create(conversation);
        }
        else {
            console.log('ConversationId: ' + conversationId + ' đã tồn tại!');
        }
    });
}

