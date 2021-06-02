const binance = require('./core');
const moment = require('moment');

const getBars = (symbol, interval = '5m', limit = 10) => {
  return new Promise((resolve) => {
    binance.candlesticks(symbol, interval, (error, ticks) => {
      if(!error) {
        if(ticks.length < limit) {
          resolve({success: false, error: `Candle bar is not more than ${limit}`});
        } else {
          // resolve({success: true, bars: formatPreviousBars(ticks)});
          resolve({
            success: true,
            bars: getOHCL(ticks),
            current: formatBar(ticks[ticks.length -  1])
          });
        }
        
      } else {
        resolve({success: false, error: error});
      }
    }, {limit: limit});
  });
};

const getOHCL = (bars) => {
  return bars.map(x => {
    return formatBar(x);
  });
};

const formatBar = (tick) => {
  return {
    openTime: moment(tick[0]).toString(),
    open: parseFloat(tick[1]),
    high: parseFloat(tick[2]),
    low: parseFloat(tick[3]),
    close: parseFloat(tick[4]),
    closeTime: moment(tick[6]).toString(),
    volume: parseFloat(tick[5]),
  };
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  var hours = date.getHours();
  // Minutes part from the timestamp
  var minutes = "0" + date.getMinutes();
  // Seconds part from the timestamp
  var seconds = "0" + date.getSeconds();

  // Will display time in 10:30:23 format
  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


  return formattedTime;
};

module.exports = getBars;