const { Util, Bounce } = require('./../lib/patterns');
const { _candleData } = require('./../lib/binance');
const _pair = `DOGE${Util.fiatAsset}`;

const run = async () => {
  const response = await _candleData(_pair, '1m', 10);
  const candleArr = response.bars;
  console.log(Bounce(candleArr));
}


run();