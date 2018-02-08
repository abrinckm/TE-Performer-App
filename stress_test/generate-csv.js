
// Returns a random integer from a Poisson distribution
// Source: http://bit.ly/2nLr1Kt
function randomPoisson(lambda) {
  if (lambda === undefined) lambda = 1;

  let l = lambda;
  let k = 0;
  let p = 1.0;
  let step = 500;
  do {
    k++;
    p *= Math.random();
    if(p < Math.E && l > 0) {
      if(l > step) {
        p *= Math.exp(step);
        l -= step;
      } else {
        p *= Math.exp(l);
        l = -1;
      }
    }
  } while (p > 1);

  return k - 1;
}

// Scales the values in the given array of integers to be between
// zero and a specified maximum value
function scaleToRange(data, maxRange) {

  let min = data[0];
  let max = min;

  data.forEach((value) => {
    if(value < min) min = value;
    if(value > max) max = value;
  });

  let diff = (max - min);

  data.forEach((value, index) => {
    data[index] = Math.floor( (value - min) / diff * maxRange );
  });

  return data;
}

// Counts the number of occurrences of numbers
// in the specified array of integers
function histogram(data, size) {

  let result = new Array(size).fill(0);

  data.forEach(value => {
    result[value]++;
  });

  return result;
}

// Renders a histogram on the plot.ly service. The
// chart is available at the URL that is shown in
// the console
function drawHistogram(data) {
  const plotly = require('plotly')("swyngaard", "Dko6MnW0cYA7qoBCoulE");

  data[0].type = 'bar';

  let layout = {
    fileopt : "overwrite",
    filename : "poisson-distribution",
  };

  plotly.plot(data, layout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });
}

// Debug function to check the distribution of poisson values
// Usage: checkDistribution(x, histogram(y, numIntervals));
function checkDistribution(x, y) {
  let data = [
    {
      x: x,
      y: y
    }
  ];

  drawHistogram(data);
}

let numEvents = 10000;
let numIntervals = 600;
let lambda = numIntervals/2;

// Generate an array of consecutive integers from 0 to numIntervals
let x = Array.from({length: numIntervals}, (value,index) => index);

// Generate an array of random integers from a Poisson distribution
let y = Array.from({length: numEvents}, () => randomPoisson(lambda));

// Scale values to span across the given interval
y = scaleToRange(y, numIntervals);
