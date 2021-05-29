const binance = require('./core');

module.exports = async (pair = false) => {
  return new Promise((resolve) => {
    binance.openOrders(pair, (error, openOrders, symbol) => {
      if(!error) {
        resolve({
          success: true,
          orders: openOrders,
          symbol: symbol
        });
      } else {
        resolve({success: false, error: error});
      }
    });
  });
}