

/**
 * @LOGIC
 * 1. The body of the candle is short with a longer lower or higher candle wick.
 * 2. Next candle should have higher volume with bullish candle
 * 3. Volume of previous 3 candles should rising
 * 4. Closing price of previous 3 candles should rising
 * @ENTRYPOINT
 *    entryPrice - 
 *    limitPrice - entryPrice + (entryPrice * util.takeProfitPercentage)
 *    stopLossTrigger - Low price of candle 1
 *    stopLossLimit - stopLoss + (stopLoss * 0.002)
 */

const util = require('./../util');

// @@TODO
const isHammer = () => {
  return true;
}

const isRisingPrice = ({candle1, candle2}) => {
  return (candle2.close > candle1.close) || (candle2.close > candle1.open);
}

const isRisingVolume = ({candle1, candle2}) => {
  return candle2.volume > candle1.volume;
}

const previousCandles = (candles) => {
  const candle1 = candles[candles.length - 3];
  const candle2 = candles[candles.length - 2];
  return {candle1, candle2};
};

const pattern = (candles) => {
  const {candle1, candle2} = previousCandles(candles);

  // Check if candle 1 is hammer
  // Check if candle 2 is bullish
  // Check if (candle 2 closing price) > (candle 1 closing and open price )
  // Check if (candle 2 volume) > (candle 1 volume) 
  if(
    isHammer(candle1) &&
    util.isBullish(candle2) &&
    isRisingPrice({candle1, candle2}) &&
    isRisingVolume({candle1, candle2})
  ) {
    // Generate entry metadata
    const entryPrice = candle2.open + (candle2.open * 0.002);
    return {
      entryPrice: entryPrice,
      limitPrice: entryPrice + (entryPrice * util.takeProfitPercentage), // Get entry price + %0.05
      stopLossTrigger: candle1.low,
      stopLossLimit: candle1.low - (candle1.low * util.stopLossPercentage), // Get opening price of previous candle
    }
  } else {
    return false;
  }
};

module.exports = pattern;