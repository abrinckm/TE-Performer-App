const os = require('os');
const numOfCores = os.cpus().length;

// parallizedRequests(5);

const parallizedRequests = function(count) {
  let cluster = require('cluster');
  if (cluster.isMaster) {
    for (let i = 0; i < count; i++) {
      let worker = cluster.fork();
      worker.on('message', function(message) {
        console.log(message.data.result);
      });
    }
    let i = 0;
    for (let wid in cluster.workers) {
      i++;
      if (i > count) { return; }
      cluster.workers[wid].send({
        type: 'request',
        data: { 
          number: i
        }
      });
    }
  } else {
    process.on('message', function(message) {
      if (message.type === 'request') {
        sendRequest(message.data.number, function(res,body) {
          let reqID = JSON.parse(body).headers['Request-Id'];
          let sCode = res.statusCode;
          process.send({
            data: {
              result: "Parallel Response #" + reqID + " returned a " + sCode
            }
          });
          process.exit(0);
        })
      }
    });
  }
}

module.exports = parallizedRequests;