const OrderBookModel = require('../models/order-book-model').model;
const controller = {};

controller.getAll = async () => {
  try {
    const result = await OrderBookModel.find();
    return {success: true, payload: result};
  } catch (error) {
    return {success: false, error: error.message};
  }
}

controller.create = async (type, price, quantity, date = '', pattern = '') => {
  try {
    await OrderBookModel.create({
      type: type,
      price: price,
      quantity: quantity,
      total: price * quantity,
      date: date,
      pattern: pattern
    });
    
    return {success: true}
  } catch (error) {
    return {success: false, error: error.message};
  }
}

controller.deleteAll = async () => {
  try {
    await OrderBookModel.deleteMany({});
    return {success: true}
  } catch (error) {
    return {success: false, error: error.message};
  }
}

module.exports = controller;