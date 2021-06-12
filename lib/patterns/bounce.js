/**
 * @LOGIC
 * - 1st, 2nd must be bearish
 * - 1st, 2nd must be falling price
 * - 3rd open/close < 2nd open
 * - 4th & 5th candle must be bullish
 * - 4th candle close > 3rd close/open
 * - 5th candle close > 4th close/open
 * - Entry price > EMA 10
 * @ENTRYPOINT
 *  entryPrice - 
 *  limitPrice - entryPrice + (entryPrice * util.takeProfitPercentage)
 *  stopLossTrigger - Low price of candle 1
 *  stopLossLimit - stopLoss + (stopLoss * 0.002)
 */

 const EMA = require('technicalindicators').EMA
const util = require('./../util');

const isFalling = (candle1, candle2) => {
  return (candle1.open > candle2.open) && (candle1.close > candle2.close);
};

const previousCandles = (candleArr) => {
  const length = candleArr.length;
  const candles = {};
  for (let i = 0; i < length; i++) {
    const element = candleArr[i];
    const count = i + 1;
    candles[`c${count}`] = element;
  }

  return candles;
};

const getEMA10 = (candles) => {
  const values = candles.map(x => {
    return x.close;
  });

  const ema = EMA.calculate({period: 10, values: values});
  return ema;
}

const pattern = (candles) => {
  const {c5, c6, c7, c8, c9} = previousCandles(candles);

  /* MAPPINGS
   * candle1 - candle 5 from 10 period candles
   * candle2 - candle 6 from 10 period candles
   * candle3 - candle 7 from 10 period candles
   * candle4 - candle 8 from 10 period candles
   * candle5 - candle 9 from 10 period candles
   * CURRENT CANDLE - candle 10 from 10 period candles
   */
  const [candle1, candle2, candle3, candle4, candle5] = [c5, c6, c7, c8, c9]; 
  const EMA10 = getEMA10(candles);

  console.log(candle1, candle2, candle3, candle4, candle5);

  if(
    util.isBearish(candle1) && util.isBearish(candle2) && // 1st, 2nd must be bearish
    isFalling(candle1, candle2) && // 1st, 2nd must be falling price
    (candle3.open < candle2.open) && (candle3.close < candle2.open) && // 3rd open/close < 2nd open
    util.isBullish(candle4) && util.isBullish(candle5) && // 4th & 5th candle must be bullish
    (candle4.close > candle3.close) && (candle4.close > candle3.open) && // 4th candle close > 3rd close/open
    (candle5.close > candle4.close) && (candle5.close > candle4.open) && // 5th candle close > 4th close/open,
    candle5.close > EMA10
  ) {
    const entryPrice = candle5.close;
    const stopPrice = candle3.low;
    const lossValue = entryPrice - stopPrice;

    return {
      entryPrice: entryPrice,
      limitPrice: entryPrice + (lossValue * 1.25),
      stopPrice: stopPrice + (stopPrice * 0.0005),
      stopLimitPrice: stopPrice
    }
  } else {
    return false;
  }
};

module.exports = pattern;