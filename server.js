const candleData = require('./lib/binance/candle-data');
const detectPattern = require('currency-pattern-detector/build').default;
const cron = require('node-cron');
const moment = require('moment');

const init = async (symbol) => {
  const check = async () => {
    const response = await candleData(symbol);
    if(response.success) {
      const candles = response.bars;
      candles.pop();
      const pattern = detectPattern(candles);
      if(pattern.bullish.length > 0) {
        console.log(moment().toString());

        console.log(`${pattern.bullish}`);
        const first = candles[candles.length - 2];
        const second = candles[candles.length - 1];
        console.log(first);
        console.log(second);
        
        console.log(moment().toString());
        console.log('--------------')
      }
    } else {
      console.log(response.error);
    }
  }

  cron.schedule('1 * * * * *', async () => {
    await check();
  });

  console.log('Running cron')
  
}

init('BNBBUSD');