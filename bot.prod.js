const cron = require('node-cron');
const _ = require('lodash');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Dubai');
const isBounce = require('./lib/patterns/bounce');
const util = require('./lib/util');
const { _binanceCore, _candleData, _openOrders, _assetBalance, _newOCO } = require('./lib/binance');
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

      const budgetLimit = 12.5;
      if(currentBalance < budgetLimit) {
        console.info(`Not enough balance ${currentBalance}`);
        return;
      };

      const orderMeta = bouncePattern;
      // orderMeta['pattern'] = 'bounce';
      // orderMeta['currentCandle'] = response.current;
      const quantity = util.precise(budgetLimit / orderMeta.entryPrice);

      // Add entry
      _binanceCore.buy(_pair, quantity, orderMeta.entryPrice, {type:'LIMIT'}, async (error, response) => {
        if(error) {
          console.error('Unable to place limit order', error);
        } else {
          console.info('Limit Buy response', response);
          console.info('placing STOP order now');

          const flags = {
            type: 'OCO',
            pair: _pair,
            limitPrice: util.precise(orderMeta.limitPrice),
            quantity: quantity,
            stopPrice: util.precise(orderMeta.stopPrice),
            stopLimitPrice: orderMeta.stopLimitPrice
          };

          const OCOResult = await _newOCO(flags);

          if(OCOResult.succcess) {
            console.info('OCO order created', OCOResult);
          } else {
            console.error(OCOResult.error);
          }
        }
      });
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

const precise = (x) => {
  const precisedValue = Number.parseFloat(x).toPrecision(4);

  if(precisedValue >= 1) {
    return parseFloat(Math.round(precisedValue));
  }

  return parseFloat(precisedValue);
};

module.exports = () => {
  try {
    start();
  } catch (error) {
    console.log(error.message);
  }
}