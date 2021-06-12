const util = {};

util.takeProfitPercentage = 0.005;
util.stopLossPercentage = 0.002;

util.fiatAsset = 'BUSD';

util.isBullish = (data) => {
  return data.close > data.open;
};

util.isBearish = (data) => {
  return data.open > data.close;
};

util.precise = (x) => {
  const precisedValue = Number.parseFloat(x).toPrecision(3);

  if(precisedValue >= 1) {
    return parseFloat(Math.round(precisedValue));
  }

  return parseFloat(precisedValue);
};

module.exports = util;