const cron = require('node-cron');
const _ = require('lodash');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Dubai');
const isBounce = require('./lib/patterns/bounce');
const { _binanceCore, _candleData } = require('./lib/binance');
const WalletController = require('./controllers/wallet-controller');
const OrderBookController = require('./controllers/orderbook-controller');
const OrderHistoryController = require('./controllers/orderhistory-controller');
const _fiatAsset = 'USDT';
const _altAsset = 'BNB';
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
    const response = await OrderBookController.getAll();

    // If success process and no pending orders. Then check candles.
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
  const response = await _candleData(_pair, '1m', 10);
  console.log('Running find and buy');
  if(response.success) {
    const candles = response.bars;
    const bouncePattern = isBounce(candles);
    if(bouncePattern) {
      const balanceResp = await getBalance();
      const currentBalance = balanceResp.payload.balance;
      const budgetLimit = 100;

      if(balanceResp.success && currentBalance < budgetLimit) {
        console.info(`Not enough balance ${currentBalance}`);
        return;
      };

      const orderMeta = bouncePattern;
      orderMeta['pattern'] = 'bounce';
      orderMeta['currentCandle'] = response.current;
      const quantity = budgetLimit / orderMeta.entryPrice;
      const currentDate = moment().toString();

      // Add entry
      const OHCResp = await OrderHistoryController.create('limit', 'buy', orderMeta.entryPrice, quantity, currentDate, 'bounce');
      
      if(OHCResp.success) {
        // Deduct total from wallet
        await updateWallet(currentBalance - (orderMeta.entryPrice * quantity));

        // Add limit order
        await OrderBookController.create('limit', orderMeta.limitPrice, quantity, currentDate, 'bounce');

        // Add stop loss order
        await OrderBookController.create('stop_loss', orderMeta.stopLimitPrice, quantity, currentDate, 'bounce');
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

const getBalance = async () => {
  return await WalletController.getWallet();
};

module.exports = () => {
  try {
    start();
  } catch (error) {
    console.log(error.message);
  }
}