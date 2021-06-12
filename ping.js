const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Dubai');
const MONGODB_DATABASE = process.env.MONGODB_DATABASE;
const bot = require('./bot');
const prodBot = require('./bot.prod');

const start = async (type = 'test') => {
  if(type == 'prod') {
    console.log(`Production Server started ${moment().toString()}`);
    prodBot();
  } else {
    console.log(`Server started ${moment().toString()}`);
    bot();
  }
};

try {
  const options = {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false};
  const mongo = mongoose.connect(MONGODB_DATABASE, options);

  mongo.then(async () => {
    console.log(`MongoDB connected to ${MONGODB_DATABASE}`);
    start('prod');
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