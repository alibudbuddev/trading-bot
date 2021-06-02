/**
 * @LOGIC
 * - 1st, 2nd must be bearish
 * - 1st, 2nd must be falling price
 * - 3rd open/close < 2nd open
 * - 4th & 5th candle must be bullish
 * - 4th candle close > 3rd close/open
 * - 5th candle close > 4th close/open
 * @ENTRYPOINT
 *  entryPrice - 
 *  limitPrice - entryPrice + (entryPrice * util.takeProfitPercentage)
 *  stopLossTrigger - Low price of candle 1
 *  stopLossLimit - stopLoss + (stopLoss * 0.002)
 */

const util = require('./util');

const isFalling = (candle1, candle2) => {
  return (candle1.open > candle2.open) && (candle1.close > candle2.close);
};

const previousCandles = (candles) => {
  const candle1 = candles[candles.length - 6]; // 6 - 6 = 0
  const candle2 = candles[candles.length - 5]; // 6 - 5 = 1
  const candle3 = candles[candles.length - 4]; // 6 - 4 = 2
  const candle4 = candles[candles.length - 3]; // 6 - 3 = 3
  const candle5 = candles[candles.length - 2]; // 6 - 2 = 4
  return {candle1, candle2, candle3, candle4, candle5};
};

const pattern = (candles) => {
const {candle1, candle2, candle3, candle4, candle5} = previousCandles(candles);

  if(
    util.isBearish(candle1) && util.isBearish(candle2) && // 1st, 2nd must be bearish
    isFalling(candle1, candle2) && // 1st, 2nd must be falling price
    (candle3.open < candle2.open) && (candle3.close < candle2.open) && // 3rd open/close < 2nd open
    util.isBullish(candle4) && util.isBullish(candle5) && // 4th & 5th candle must be bullish
    (candle4.close > candle3.close) && (candle4.close > candle3.open) && // 4th candle close > 3rd close/open
    (candle5.close > candle4.close) && (candle5.close > candle4.open) // 5th candle close > 4th close/open
  ) {

    //  Generate entry metadata
    const entryPrice = candle5.open + (candle5.open * 0.002);

    return {
      entryPrice: entryPrice,
      limitPrice: entryPrice + (entryPrice * util.takeProfitPercentage),
      stopLossTrigger: candle3.low,
      stopLossLimit: candle3.low - (candle3.low * util.stopLossPercentage)
    }
  } else {
    return false;
  }
};

module.exports = pattern;