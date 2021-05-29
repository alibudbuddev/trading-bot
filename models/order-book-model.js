const mongoose = require('mongoose');

var orderBookSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['stop_loss', 'limit'],
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

const orderBookModel = mongoose.model('order_book', orderBookSchema);

mongoose.set('useFindAndModify', false);

exports.model = orderBookModel;
exports.schema = orderBookSchema;