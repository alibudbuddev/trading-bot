const OrderHistoryModel = require('../models/order-history-model').model;
const controller = {};

controller.getAll = async () => {
  try {
    const result = await OrderHistoryModel.find({});
    return {success: true, payload: result};
  } catch (error) {
    return {success: false, error: error.message};
  }
}

controller.create = async (type, side, price, quantity, date = '', pattern = '') => {
  return new Promise((resolve) => {
    try {
      OrderHistoryModel.create({
        type: type,
        side: side,
        price: price,
        quantity: quantity,
        total: price * quantity,
        date: date,
        pattern: pattern
      }, (err) => {
        if(err) {
          console.log(err.message);
          resolve({success: false, error: err});
        } else {
          resolve({success: true});
        }
      });
    } catch (error) {
      resolve({success: false, error: error.message});
    }
  });
}

module.exports = controller;