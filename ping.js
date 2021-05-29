const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const cron = require('node-cron');
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Dubai');
const detectPattern = require('currency-pattern-detector/build').default;
const MONGODB_DATABASE = 'mongodb+srv://pmiGTtest:123qwe@cluster0.v5zev.mongodb.net/binance_test?authSource=admin&replicaSet=atlas-jyx4bp-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';
const { _binanceCore, _openOrders, _candleData, _assetBalance, _cancelAllOrders } = require('./lib/binance');
const WalletController = require('./controllers/wallet-controller');
const OrderBookController = require('./controllers/orderbook-controller');
const OrderHistoryController = require('./controllers/orderhistory-controller');
const _fiatAsset = 'BUSD';
const _altAsset = 'XRP';
const _pair = `${_altAsset}${_fiatAsset}`;
const _tpPercentage = 0.005;

const start = async () => {
  console.log(`Server started ${moment().toString()}`);
  cron.schedule('1 * * * * *', async () => {
    console.log(`Running this app every minute ${moment().toString()}`);
  });
};

try {
  const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
  const mongo = mongoose.connect(MONGODB_DATABASE, options);

  mongo.then(async () => {
    console.log(`MongoDB connected to ${MONGODB_DATABASE}`);
    start();
  }, error => {
    console.error('MongoDB connection error:', error);
    
  })
} catch (error) {
  console.log(error.message);
}

app.get('*', (req, res) => {
  res.json({msg: 'hello'})
});

const port = process.env.PORT || 3000;
app.set('port', port);

server.listen(port, () => console.log(`Our server is running on: ${port}`));