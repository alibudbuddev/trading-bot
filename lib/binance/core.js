const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '3xfsKWzbC3IeuFIKpZz34a7N4jgf13aZ3uY5cxHkkl72qvkLkKlCB817nkMlG3X4',
  APISECRET: 'MQISOPLCwWY7xctKw15B3EyQQ6RcxBmNz9obUmItpIJtYFFHVoNdmI33k61i2FKV'
});

module.exports = binance;