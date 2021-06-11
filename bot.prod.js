const cron = require('node-cron');
const _ = require('lodash');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Dubai');
const isBounce = require('./lib/patterns/bounce');
const { _candleData, _openOrders, _assetBalance } = require('./lib/binance');
const _fiatAsset = 'USDT';
const _altAsset = 'GTC';
const _pair = `${_altAsset}${_fiatAsset}`;

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
    const response = await _openOrders(_pair);
    if(!response.success) {
      console.log('Unable to check orders due to errors', result.error.body);
      return;
    }

    // If success process and no pending orders. Then check candles.
    if(response.success && response.orders.length < 1) {
      findAndBuy();
    }

    if(!response.success) {
      console.log(response.error);
    }
  });
};

const findAndBuy = async () => {
  const response = await _candleData(_pair, '1m', 10);
  console.log('Running find and buy');
  if(response.success) {
    const candles = response.bars;
    const bouncePattern = isBounce(candles);
    if(bouncePattern) {
      const currentBalance = await getBalance();

      if(typeof currentBalance == 'boolean' && !currentBalance) {
        // There's an error. Stop the process;
        return;
      }

      const budgetLimit = 100;
      if(currentBalance < budgetLimit) {
        console.info(`Not enough balance ${currentBalance}`);
        return;
      };

      const orderMeta = bouncePattern;
      orderMeta['pattern'] = 'bounce';
      orderMeta['currentCandle'] = response.current;
      const quantity = budgetLimit / orderMeta.entryPrice;
      // const currentDate = moment().toString();

      console.log(quantity, orderMeta);

      // // Add entry
      // const OHCResp = await OrderHistoryController.create('limit', 'buy', orderMeta.entryPrice, quantity, currentDate, 'bounce');
      
      // if(OHCResp.success) {
      //   // Deduct total from wallet
      //   await updateWallet(currentBalance - (orderMeta.entryPrice * quantity));

      //   // Add limit order
      //   await OrderBookController.create('limit', orderMeta.limitPrice, quantity, currentDate, 'bounce');

      //   // Add stop loss order
      //   await OrderBookController.create('stop_loss', orderMeta.stopLossLimit, quantity, currentDate, 'bounce');
      //   console.log(`Long position placed with below data \n`, orderMeta);
      // }
    }
  } else {
    console.log(response.error);
  }
}

const getBalance = async () => {
  const response = await _assetBalance(_fiatAsset);
  if(!response.success) {
    console.log('Unable to check balance due to errors', response.error);
    return false;
  }
  return response.balance;
};

module.exports = () => {
  try {
    start();
  } catch (error) {
    console.log(error.message);
  }
}