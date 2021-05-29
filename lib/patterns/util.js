const util = {};

util.takeProfitPercentage = 0.004;
util.stopLossPercentage = 0.002;

util.fiatAsset = 'BUSD';

util.isBullish = (data) => {
  return data.close > data.open;
};

util.isBearish = (data) => {
  return data.open > data.close;
};

module.exports = util;