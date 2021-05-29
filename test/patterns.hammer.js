const { Util, Hammer } = require('./../lib/patterns');
const { _candleData } = require('./../lib/binance');
const _pair = `XRP${Util.fiatAsset}`;

const run = async () => {
  const response = await _candleData(_pair);
  console.log('current',response.bars)
  // console.log('current',response.current)
  Hammer(response.bars)
}

run();