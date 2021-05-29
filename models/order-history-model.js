const mongoose = require('mongoose');

var orderHistorySchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['stop_loss', 'limit', 'limit_maker']
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  total: {
    type: Number
  },
  date: {
    type: String
  },
  pattern: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const orderHistoryModel = mongoose.model('order_history', orderHistorySchema);

mongoose.set('useFindAndModify', false);

exports.model = orderHistoryModel;
exports.schema = orderHistorySchema;