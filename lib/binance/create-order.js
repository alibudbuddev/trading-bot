const binance = require('./core');

module.exports = async () => {
  return new Promise((resolve) => {
    binance.balance((error, balances) => {
      if(!error) {
        resolve({
          success: true,
          balances: balances
        });
      } else {
        resolve({success: false, error: error});
      }
    });
  });
}