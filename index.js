/* ****************************************************** 
  TODO(Adam): spawn 4 workers for each performer category
******************************************************** */

const EventEmitter = require('events');
const taskScheduler = new EventEmitter();

let start_time;

// NOTE(Adam): Tasks execute Async requests and are concurrent
const task = function(task_id, user_id, problem_id, workflow_id) {
  let sec_elapsed = (Date.now()/1000) - start_time;

  // TODO(Adam): Import the workflow 
  // let workflow = require('workflow');
  
  // TODO(Adam): Execute workflow, then log output
  // workflow.then(() =>  {/*output to log with guid to match */});

  console.log(`executing task ${task_id} at ${sec_elapsed} sec after start.`);
}

// NOTE(Adam): For every row in the csv file is one task (or workflow)
for (let i = 0; i < 100; ++i) {

  // TODO(Adam): Check if the task for this row is delegated to this performer system; continue if not

  // TODO(Adam): Extract performer system, user_id, problem_id (or workflow_id)
  // TODO(Adam): Extract Poisson timedelta for the task
  // TODO(Adam): Assign a task_id
  let user_id, problem_id, workflow_id, task_id = i;

  taskScheduler.setMaxListeners(5000); // TODO(Adam): Determine number of listeners before hand??

  // NOTE(Adam): Await the start signal before setting the timeouts.
  taskScheduler.on('start', () => {
    // TODO(Adam): Set the proper timedelta for the task
    setTimeout(
      task.bind(this, task_id, user_id, problem_id, workflow_id), 
      (i%5)*1000  /* <replace this with Poisson timedelta> */)
    ;
  });
}

start_time = Date.now() / 1000;
taskScheduler.emit('start');