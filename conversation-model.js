//Require Mongoose
var mongoose = require('mongoose');

//Định nghĩa một schema
var Schema = mongoose.Schema;

var ConversationSchemaModel = new Schema({
  // _id: Schema.Types.ObjectId,
  id: String,
  conversationId: String
});

exports.conversationModel = function () {
  return ConversationSchemaModel;
}