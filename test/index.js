const EMA = require('technicalindicators').EMA

let period = 8;
let values = [1,3,4,5,6,7,8,9,10,11,12,13,14,15];                    
const result = EMA.calculate({period : period, values : values});

console.log(result);