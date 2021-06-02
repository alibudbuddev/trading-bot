// const hammer = require('technicalindicators').bullishhammerstick;

// var singleInput = {
//   open: [30.10],
//   high: [32.10],
//   close: [32.10],
//   low: [29],
// }

// const result = hammer(singleInput) ? 'yes' : 'no';
// console.log(`Is Bullish Hammer Pattern? : ${result}`);


const hammer = require('technicalindicators').bullishinvertedhammerstick;

var singleInput = {
  open: [0.8251],
  high: [0.8267],
  low: [0.8242],
  close: [0.8256],
  
}

const result = hammer(singleInput) ? 'yes' : 'no';
console.log(`Is Bullish Hammer Pattern? : ${result}`);