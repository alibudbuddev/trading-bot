const binance = require('./core');

module.exports = async (symbol) => {
  return new Promise((resolve) => {
    binance.cancelAll(symbol, (error) => {
      if(!error) {
        resolve({
          success: true
        });
      } else {
        resolve({success: false});
      }
    });
  });
}