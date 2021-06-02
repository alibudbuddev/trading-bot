const { Util, Bounce } = require('./../lib/patterns');
const { _candleData } = require('./../lib/binance');
const _pair = `DOGE${Util.fiatAsset}`;

const run = async () => {
  const response = await _candleData(_pair, '1m', 6);
  Bounce(response.bars);
}

run();