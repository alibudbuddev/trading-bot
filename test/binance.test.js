const { _binanceCore, _openOrders, _candleData, _assetBalance } = require('./../lib/binance');
const _fiatAsset = 'USDT';
const _altAsset = 'BTC';
const _pair = `${_altAsset}${_fiatAsset}`;

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

test.run = () => {
  // test.openOrders();
  // test.candleData();
  test.assetBalance();
}

test.run();