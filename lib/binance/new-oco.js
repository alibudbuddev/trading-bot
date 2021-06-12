const binance = require('./core');

module.exports = async ({pair, limitPrice, quantity, stopPrice, stopLimitPrice}) => {
  return new Promise((resolve) => {
    binance.sell(pair, quantity, limitPrice, {stopPrice, stopLimitPrice}, (error, response) => {
      if(!error) {
        resolve({
          success: true,
          response: response
        });
      } else {
        resolve({success: false, error: error});
      }
    });
  });
}