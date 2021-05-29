const getBars = require('./lib/binance/candle-data');

const isLong = (symbol) => {
  // Check if long or short
};

const init = async (symbol) => {
  const check = async () => {
    const isLong = await isLong(symbol);

    if(isLong) {
      // Call long method
    } else {
      // Call short method
    }
  }

  check();
  setInterval(check, 60 * 1000);
}

// const checkAndOrder = async () => {
//   const payload = await getBars('DOTBUSD');

//   if(!payload.success) return;

//   const bar1 = payload.bars.bar1;
//   const bar2 = payload.bars.bar2;
//   console.log(bar1, bar2)
//   if (
//     (bar1 && bar2) &&
//     (bar1.close < bar1.open) &&
//     (bar2.close > bar2.open) &&
//     (bar2.close > bar1.open) &&
//     (bar2.open < bar1.close)
//   ) {
//     // Get 10% of account value
//     const willingToSpend = getAccountValue() * .1;
//     // Find how many shares we can buy with 10% of account value
//     const amt = Math.floor(willingToSpend / bar2.c);
//     // Buy this stock
//     const purchase = await buyMarket({symbol, amt});
//     // set stop at bar1 low price
//     sellStop({symbol, price: bar1.l, amt});
//     // set 100% limit sell at 2:1 profit ratio, which comes out to ((purchase price - stop price) * 2) + purchase price
//     const profitTarget = ((purchase.price - bar1.l) * 2) + purchase.price;
//     sellLimit({symbol, price: profitTarget, amt});
//   }
// }

init('ADABUSD');