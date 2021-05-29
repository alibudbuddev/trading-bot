// const _module = require('./../asset-balance');
// const run = async (symbol) => {
//   const response = await _module(symbol);
//   console.log(response);
// }
// run('SHIB');

// const _module = require('./../open-orders');
// const run = async (pair = false) => {
//   const response = await _module(pair);
//   console.log(response);
// }
// run();


// const _module = require('./../cancel-all-orders');
// const run = async (symbol) => {
//   const response = await _module(symbol);
//   console.log(response);
// }
// run('XRPBUSD');

const _module = require('./../candle-data');
const run = async (symbol) => {
  const response = await _module(symbol);
  console.log(response);
}
run('XRPBUSD');

// const moment = require('moment');
// const _module = require('./../account-info');
// const run = async () => {
//   console.log(moment().toString())
//   const response = await _module();
//   if(response.success) {
//     console.log(parseFloat(response.balances.XRP.available))
//     console.log(moment().toString())
//   }
// }
// run();