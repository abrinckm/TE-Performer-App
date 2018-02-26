const fs = require('fs');
const readline = require('readline');
const yargs = require('yargs');

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
// Usage: checkDistribution(histogram(y, numIntervals));
function checkDistribution(y) {

  // Generate an array of consecutive integers from 0 to numIntervals
  let x = Array.from({length: numIntervals}, (value,index) => index);

  let data = [
    {
      x: x,
      y: y
    }
  ];

  drawHistogram(data);
}

const DEFAULT_SECONDS = 30;

const argv = yargs
  .usage('Usage: $0 [options] <file>')
  .example('$0 input.csv', 'Generate a timing column for an input CSV file')
  .example('$0 -s 600 input.csv', 'Optionally set the total time in seconds, defaults to 30 seconds')
  .demandCommand(1, 1, 'ERROR: Please specify a CSV input file')
  .number('s')
  .default('s', DEFAULT_SECONDS)
  .alias('s', 'seconds')
  .describe('s', 'Total interval of time in seconds')
  .help('h')
  .alias('h', 'help')
  .version(false)
  .argv;

let numEvents = 0;
let numIntervals = argv.seconds; // total time in seconds
let lambda = numIntervals/2; // the time at which most events should occur
let inputFilePath = argv._[0];
let outputFilePath = `stress_test/events_${Math.floor(Date.now()/1000)}.csv`;

fs.createReadStream(inputFilePath)
  .on('data', function(chunk) {
    // Rapidly read the number of lines/events in the input file
    for (let i = 0; i < chunk.length; i++) {
      const LINE_FEED = '\n'.charCodeAt(0);
      if (chunk[i] === LINE_FEED) numEvents++;
    }
  })
  .on('end', function() {
    // Subtract 1 so that the CSV file header is not counted
    numEvents--;

    // Generate an array of random integers from a Poisson distribution
    let startTimes = Array.from({length: numEvents}, () => randomPoisson(lambda));

    // Scale values to span across the given interval
    startTimes = scaleToRange(startTimes, numIntervals);

    let instream = fs.createReadStream(inputFilePath);
    let outstream = fs.createWriteStream(outputFilePath);
    let rl = readline.createInterface(instream, outstream);
    let lineCount = 0;

    // Read the input file line by line and append the timing
    // column then write to output file
    rl.on('line', function(line) {
      if(lineCount === 0)
        outstream.write(`${line},time\n`);
      else
        outstream.write(`${line},${startTimes[lineCount-1]}\n`);
      lineCount++;
    });
  });
