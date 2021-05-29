const cron = require('node-cron');
const mongoose = require('mongoose');
const fs = require('fs');
const detectPattern = require('currency-pattern-detector/build').default;
const MONGODB_DATABASE = 'mongodb+srv://pmiGTtest:123qwe@cluster0.v5zev.mongodb.net/binance_test?authSource=admin&replicaSet=atlas-jyx4bp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';
const { _binanceCore, _openOrders, _candleData, _assetBalance, _cancelAllOrders } = require('./lib/binance');
const LogController = require('./log.controller');
const _fiatAsset = 'BUSD';
const _altAsset = 'XRP';
const _pair = `${_altAsset}${_fiatAsset}`;
const _tpPercentage = 0.005;

/**
 * Steps for the trading logic.
 * 1. Check if has pending order
 *    @@ IF HAS NO PENDING ORDERS @@
 *    1. Get latest candles
 *    2. Detect pattern
 *    3. Generate OCO order values
 *    4. Send OCO order if has bullish pattern
 */

const start = () => {
  cron.schedule('1 * * * * *', async () => {
    const response = await _openOrders();

    // If success process and no pending orders.
    // Generate OCO order values
    if(response.success && response.orders.length < 1) {
      findAndBuy();
    }

    if(!response.success) {
      console.log(response.error);
    }
  });
};

const findAndBuy = async () => {
  const response = await _candleData(_pair);
  if(response.success) {
    const candles = response.bars;
    candles.pop();
    const pattern = detectPattern(candles);

    // Check if bullish pattern is in choices of pattern
    // if(checkIfPatternIsValid(pattern.bullish)) {
      const orderMeta = getOrderMetadata(response.current, candles[candles.length - 1]);
      console.log(orderMeta);
      // TODO: Initiate sell limit order
    // }
  } else {
    console.log(response.error);
  }
}


// Check if selected patterns is detected
const checkIfPatternIsValid = (detectedPatterns = []) => {
  try {
    if(detectedPatterns.indexOf('Harami') >= 0) {
      return true;
    }
  
    if(detectedPatterns.indexOf('Engulfing') >= 0) {
      return true;
    }
  
    return false;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const getOrderMetadata = (currentCandle, previousCandle) => {
  const entryPrice= currentCandle.open + (currentCandle.open * 0.001);
  const stopLoss = previousCandle.close;
  const payload = {
    entryPrice: entryPrice,
    limitPrice: entryPrice + (entryPrice * _tpPercentage), // Get entry price + %0.05
    stopLossTrigger: stopLoss + (stopLoss * 0.002),
    stopLossLimit: stopLoss // Get opening price of previous candle
  };
  return payload;
};

const getBalance = async () => {
  return await LogController.getWallet();
};

const addLog = async (identifier, balance) => {
  const result = await LogController.updateOrCreate({balance, identifier});
  console.log(result);
};

// start();
// findAndBuy();


try {
  const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
  const mongo = mongoose.connect(MONGODB_DATABASE, options);

  mongo.then(async () => {
    console.log(`MongoDB connected to ${MONGODB_DATABASE}`);
    const result = await getBalance();
    console.log(result)
  }, error => {
    console.error('MongoDB connection error:', error);
    
  })
} catch (error) {
  console.log(error.message);
}