const cluster = require('cluster');

if (cluster.isMaster) {
  let performer_systems = require('config').get('performer-systems');
  let workers_ready = 0;
    
  let tasks_file = process.argv[2];
  let file_contents = require('fs').readFileSync(tasks_file).toString();

  // NOTE(Adam): Making the assumption that the tasks file is in CSV format
  //             Parse the CSV file and separate tasks for workers
  let rows = file_contents.split('\n');
  let headers = rows.shift().split(',');
  let tasks_per_worker = performer_systems.reduce((acc, sys)=>{
    acc[sys.name] = [];
    return acc;
  }, {});
  let performer_systems_names = Object.keys(tasks_per_worker);

  rows.forEach((row, index) => {
    if (row !== '') {
      let i = 0;
      let action = row.split(',').reduce((acc, col) => {
        let header_name = headers[i++];
        acc[header_name] = col;
        return acc;
      }, {});
      action['id'] = index;
      
      action.system = action.system.toUpperCase();
      if (action.system === 'RANDOM') {
        let idx = Math.floor(Math.random() * Math.floor(performer_systems_names.length));
        action.system = performer_systems_names[idx];
      }
    
      if (tasks_per_worker[action.system]) {
        tasks_per_worker[action.system].push(action);
      } 
    }
  });

  const eachWorker = function(cb) {
    for (const id in cluster.workers) {
      process.nextTick(cb.bind(cb, cluster.workers[id]));
    }
  };

  // NOTE(Adam): Fork one worker per performer system
  for (let i = 0; i < performer_systems.length; ++i) {
    let performer_name = performer_systems[i].name.toUpperCase();
    const worker = cluster.fork({
      performer_system: performer_name,
      tasks_file: tasks_file
    });
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
    worker.send(tasks_per_worker[performer_name]);
  }
} else if (cluster.isWorker) {
  let sys = process.env.performer_system;
  console.log(`[Worker ${process.pid}]: Started node for performer: ${sys}`);

  // NOTE(Adam): A task will execute a series of async requests to T&E API to simulate a workflow
  const executeTask = (worker_id, task_id, user_id, problem_id, workflow_id, num_of_tasks) => {
    let sec_elapsed = (Date.now() - process.env.start_time) / 1000;

    // TODO(Adam): Import the workflow 
    const workflow = require('./workflow.js');
    
    // TODO(Adam): Execute workflow, then log output
    workflow.run(workflow_id, user_id, problem_id, (obj)=>{
      console.log(`[Worker ${worker_id}]: (${process.env.performer_system} ${task_id}) User ${user_id} is executing workflow ${workflow_id} at ${Math.floor(sec_elapsed)} sec after start.`);
      let event_output = {
        id: task_id,
        system: sys,
        user: user_id,
        workflow: workflow_id,
        problem: problem_id,
        results: obj
      };
      console.log(JSON.stringify(event_output, null, 0));
      // workflow.then(() =>  {/*output to log with guid to match */});

      // NOTE(Adam): The following if statement will need to be moved into the resulting workflow promise chain.
      if (++process.env.tasks_executed >= process.env.tasks_length) {
        console.log(`-----------------------------------------------------------`);
        console.log(`[Worker ${process.pid}]: Ended node for performer: ${process.env.performer_system}`);
        console.log(`Total number of tasks executed: ${process.env.tasks_executed}`);
        console.log(`Total time taken: ${sec_elapsed} seconds`);
        console.log(`-----------------------------------------------------------`);
        process.exit(0);
      }
    });
  };

  const handleMessage = (msg) => {
    if (typeof(msg) === 'string') {
      console.log(`[Worker ${process.pid}]: Received message: ${msg}`);
      return;
    } else if (typeof(msg) === 'object' && msg.toString() === '[object Object]') {
      // TODO(Adam): Handle unknown object message 
      console.log(`[Worker ${process.pid}]: Received unknown object message`);
      return;
    } else {
      // TODO(Adam): Handle unexpected message format
      console.log(`[Worker ${process.pid}]: Received unexpected format for message`);
      return;
    }
  };

  const initializeTaskDistribution = (msg) => {
    // NOTE(Adam): Making the assumption that an array is the list of tasks
    if (Array.isArray(msg)) {   
      let tasks = msg;
      process.setMaxListeners(tasks.length + 3); 
      process.env.tasks_length = tasks.length;
      process.env.tasks_executed = 0;

      console.log(`[Worker ${process.pid}]: (${process.env.performer_system}) Total number of tasks to execute: ${process.env.tasks_length}`);

      const setStartTime = (msg) => {
        if (msg === 'start') {
          process.env.start_time = Date.now();
        }
        process.removeListener('message', setStartTime);
      };

      process.on('message', setStartTime);

      for (let i = 0; i < tasks.length; ++i) {
        let task_id = i;  
        let task = tasks[i];
        
        // NOTE(Adam): Await the start signal before setting the timeouts.
        process.on('message', msg => {
          let drift = (!process.env.start_time) ? 0 : Date.now() - process.env.start_time;
          if (msg === 'start') {
            setTimeout(
              executeTask.bind(this, process.pid, task.id, task.user, task.problem, task.activity, tasks.length),
              (task.time * 1000) - drift  // NOTE(Adam): Time delta in seconds from the start time
            );
          } else {
            return handleMessage(msg);
          }
        });
      }

      process.removeListener('message', initializeTaskDistribution);

      process.send('ready');
    } else {
      return handleMessage(msg);
    }
  };

  process.on('message', initializeTaskDistribution);
}
