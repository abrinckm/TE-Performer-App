/*
  spawn 4 workers for each performer category

*/
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

let start;

const task = function(i) {
  let sec_elapsed = (Date.now()/1000) - start;

  // let workflow = require('workflow');
  // workflow.then(() =>  {/*output to log with guid to match */});
  console.log(`executing task ${i} at ${Math.floor(sec_elapsed)} sec after start.`);
}

for (let i = 0; i < 10; ++i) {
  myEmitter.on('start', () => {
    setTimeout(task.bind(this, i), 1000);
  });
}

start = Date.now() / 1000;
myEmitter.emit('start');