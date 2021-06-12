const { _binanceCore, _openOrders, _candleData, _assetBalance, _newOCO } = require('./../lib/binance');
const _fiatAsset = 'USDT';
const _altAsset = 'XRP';
const _pair = `${_altAsset}${_fiatAsset}`;
const prodBot = require('./../bot.prod');

const test = {};

test.openOrders = async () => {
  const response = await _openOrders(_pair);
  if(!response.success) {
    console.log('Unable to check orders due to errors', response.error.body);
    return;
  }
  console.log(response);
}

test.candleData = async () => {
  const response = await _candleData(_pair, '1m', 10);
  if(!response.success) {
    console.log('Unable to check orders due to errors', response.error.body);
    return;
  }
  console.log(response);
}

test.assetBalance = async () => {
  const response = await _assetBalance('USDT');
  if(!response.success) {
    console.log('Unable to check balance due to errors', response.error);
    return;
  }
  console.log(response.balance);
}

test.oco = async () => {
  const flags = {
    type: 'OCO',
    pair: _pair,
    limitPrice: 0.86000000,
    quantity: 13.95,
    stopPrice: 12.1,
    stopLimitPrice: 12
  };

  const response = await _newOCO(flags);
  if(!response.success) {
    console.log('Unable to create OCO order due to errors', response.error);
    return;
  }
  console.log(response);
}

test.run = () => {
  // test.openOrders();
  // test.candleData();
  // test.assetBalance();
  // prodBot();
  // test.oco();
}

test.run();