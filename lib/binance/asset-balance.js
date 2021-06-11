const binance = require('./core');

module.exports = async (symbol) => {
  return new Promise((resolve) => {
    binance.balance((error, balances) => {
      if(!error) {
        try {
          resolve({
            success: true,
            balance: parseFloat(balances[symbol].available)
          });
        } catch (error) {
          resolve({success: false, error: error.message});
        }
      } else {
        resolve({success: false, error: error});
      }
    });
  });
}