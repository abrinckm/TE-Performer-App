const cluster = require('cluster');

if (cluster.isMaster) {
  let performer_systems = require('config').get('performer-systems');
  let workers_ready = 0;
  
  const eachWorker = function(cb) {
    for (const id in cluster.workers) {
      process.nextTick(cb.bind(cb, cluster.workers[id]));
    }
  }

  for (let i = 0; i < performer_systems.length; ++i) {
    const worker = cluster.fork(performer_systems[i]);
    worker.on('message', msg => {
      if (msg === 'ready') {
        if (++workers_ready === performer_systems.length) {
          eachWorker(worker=>worker.send('start'));
        }
      } else {
        // NOTE(Adam): Handle any other message coming from workers
        console.log(`[Master]: Received message: ${msg}`);
        return;
      }
    });
  }
} else if (cluster.isWorker) {
  let sys = process.env.name;
  console.log(`[Worker ${process.pid}]: Started with environment: ${sys}`);

  let start_time;
  let num_of_tasks = 10;  // TODO(Adam): Parse out number of tasks from the CSV

  // NOTE(Adam): A task will execute a series of async requests to T&E API to simulate a workflow
  const task = function(worker_id, task_id, user_id, problem_id, workflow_id) {
    let sec_elapsed = (Date.now() / 1000) - start_time;

    // TODO(Adam): Import the workflow 
    // let workflow = require('workflow');
    
    // TODO(Adam): Execute workflow, then log output
    // workflow.then(() =>  {/*output to log with guid to match */});
    console.log(`[Worker ${worker_id}]: Executing task ${task_id} at ${sec_elapsed} sec after start.`);

    // NOTE(Adam): The following if statement will need to be moved into the resulting workflow promise chain.
    if (task_id === (num_of_tasks-1)) {
      process.exit(0);
    }
  }

  // NOTE(Adam): For every row in the csv file is one task (or workflow)
  process.setMaxListeners(5000); // TODO(Adam): Determine number of listeners from the CSV file??
  for (let i = 0; i < num_of_tasks; ++i) {
    // TODO(Adam): Check if the task for this row is delegated to this performer system; continue if not
    // TODO(Adam): Extract performer system, user_id, problem_id (or workflow_id)
    // TODO(Adam): Extract Poisson timedelta for the task
    // TODO(Adam): Assign a task_id
    let user_id, problem_id, workflow_id, task_id = i;
    
    // NOTE(Adam): Await the start signal before setting the timeouts.
    process.on('message', msg => {
      if (msg === 'start') {
        start_time = Date.now() / 1000;
        setTimeout(
          task.bind(this, process.pid, task_id, user_id, problem_id, workflow_id), 
          (i%5)*1000  /* <replace this with Poisson timedelta> */
        );
      } else {
        console.log(`[Worker ${process.pid}]: Received message: ${msg}`);
        return;
      }
    });
  }
  process.send('ready');
}
