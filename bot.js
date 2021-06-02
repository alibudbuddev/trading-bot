const cron = require('node-cron');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Dubai');
const isBounce = require('./lib/patterns/bounce');
const MONGODB_DATABASE = 'mongodb+srv://pmiGTtest:123qwe@cluster0.v5zev.mongodb.net/binance_test?authSource=admin&replicaSet=atlas-jyx4bp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';
const { _binanceCore, _openOrders, _candleData, _assetBalance, _cancelAllOrders } = require('./lib/binance');
const WalletController = require('./controllers/wallet-controller');
const OrderBookController = require('./controllers/orderbook-controller');
const OrderHistoryController = require('./controllers/orderhistory-controller');
const _fiatAsset = 'BUSD';
const _altAsset = 'DOGE';
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

const start = async () => {
  console.log('Bot running');
  cron.schedule('1 * * * * *', async () => {
    const response = await OrderBookController.getAll();

    // If success process and no pending orders. Then check candles.
    console.log('running')
    if(response.success && response.payload.length < 1) {
      findAndBuy();
    } else {
      console.log('Running find and sell');
      _binanceCore.prices(_pair, async (error, ticker) => {
        if(!error) {
          const currentPrice = parseFloat(ticker[_pair]);
          const limitData = _.find(response.payload, {type: 'limit'});
          const stopLossData = _.find(response.payload, {type: 'stop_loss'});
          const currentDate = moment().toString();

          if(currentPrice >= limitData.price) {
            // Sell limit
            const OHCResp = await OrderHistoryController.create('limit_maker', 'sell', limitData.price, limitData.quantity, currentDate, limitData.pattern);
            if(OHCResp.success) {
              // Deduct total from wallet
              const balanceResp = await getBalance();
              const currentBalance = balanceResp.payload.balance;
              await updateWallet(currentBalance + (limitData.price * limitData.quantity));

              await OrderBookController.deleteAll();
              console.log(`Short position placed with below data \n`, limitData);
            }
          } else if(currentPrice <= stopLossData.price) {
            const OHCResp = await OrderHistoryController.create('stop_loss', 'sell', stopLossData.price, stopLossData.quantity, currentDate, stopLossData.pattern);
            if(OHCResp.success) {
              // Deduct total from wallet
              const balanceResp = await getBalance();
              const currentBalance = balanceResp.payload.balance;
              await updateWallet(currentBalance + (stopLossData.price * stopLossData.quantity));

              await OrderBookController.deleteAll();
              console.log(`Short position placed with below data \n`, stopLossData);
            }
          }
        } 
      });
    }

    if(!response.success) {
      console.log(response.error);
    }
  });
};

const findAndBuy = async () => {
  const response = await _candleData(_pair, '1m', 6);
  console.log('Running find and buy');
  if(response.success) {
    if(isBounce(response.bars)) {
      const balanceResp = await getBalance();
      const currentBalance = balanceResp.payload.balance;
      const budgetLimit = 100;

      if(balanceResp.success && currentBalance < budgetLimit) {
        console.info(`Not enough balance ${currentBalance}`);
        return;
      };

      const orderMeta = getOrderMetadata(response.current, candles[candles.length - 1], pattern.bullish.toString());
      const quantity = budgetLimit / orderMeta.entryPrice;
      const currentDate = moment().toString();

      // Add entry
      const OHCResp = await OrderHistoryController.create('limit', 'buy', orderMeta.entryPrice, quantity, currentDate, pattern.bullish.toString());
      
      if(OHCResp.success) {
        // Deduct total from wallet
        await updateWallet(currentBalance - (orderMeta.entryPrice * quantity));

        // Add limit order
        await OrderBookController.create('limit', orderMeta.limitPrice, quantity, currentDate, pattern.bullish.toString());

        // Add stop loss order
        await OrderBookController.create('stop_loss', orderMeta.stopLossLimit, quantity, currentDate, pattern.bullish.toString());
        console.log(`Long position placed with below data \n`, orderMeta);
      }
    }
  } else {
    console.log(response.error);
  }
}

const updateWallet = async (balance) => {
  await WalletController.updateOrCreate(balance);
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

const getOrderMetadata = (currentCandle, previousCandle, pattern) => {
  const entryPrice= currentCandle.open + (currentCandle.open * 0.001);
  const stopLoss = previousCandle.close;
  const payload = {
    entryPrice: entryPrice,
    limitPrice: entryPrice + (entryPrice * _tpPercentage), // Get entry price + %0.05
    stopLossTrigger: stopLoss + (stopLoss * 0.002),
    stopLossLimit: stopLoss, // Get opening price of previous candle
    currentCandle: currentCandle,
    pattern: pattern
  };
  return payload;
};

const getBalance = async () => {
  return await WalletController.getWallet();
};

const addLog = async () => {
  const result = await WalletController.updateOrCreate(125.32);
  console.log(result);
};

module.exports = () => {
  try {
    // const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
    // const mongo = mongoose.connect(MONGODB_DATABASE, options);
    start();
    // mongo.then(async () => {
    //   console.log(`MongoDB connected to ${MONGODB_DATABASE}`);
    //   start();
    // }, error => {
    //   console.error('MongoDB connection error:', error);
      
    // })
  } catch (error) {
    console.log(error.message);
  }
}