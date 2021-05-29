const mongoose = require('mongoose');

var walletSchema = mongoose.Schema({
  id: {
    default: 1,
    type: Number
  },
  balance: {
    type: Number
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const walletModel = mongoose.model('wallet', walletSchema);

mongoose.set('useFindAndModify', false);

exports.model = walletModel;
exports.schema = walletSchema;