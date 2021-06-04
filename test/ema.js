const EMA = require('technicalindicators').EMA
const { Util, Hammer } = require('./../lib/patterns');
const { _candleData } = require('./../lib/binance');
const _pair = `DOGE${Util.fiatAsset}`;

const run = async () => {
  const period = 10;
  const response = await _candleData(_pair, '1m', period);
                    
  const values = response.bars.map(x => {
    return x.close;
  });
  const result = EMA.calculate({period: period, values: values});

  console.log(result);

}

run();