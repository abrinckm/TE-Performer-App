const Mocha = require('mocha');
const jsreporter = require('../src/reporters/json-reporter');

function run(workflow_id, user_id, problem_id, callback){
  let mocha = new Mocha({reporter: jsreporter});
  delete require.cache[require.resolve('./b0.js')];
  mocha.addFile('./stress_test/b0.js');
  let runner = mocha.run(function(failures){
    process.on('exit', function () {
      process.exit(failures);  // exit with non-zero status if there were failures
    });
  });

  runner.on('_done', function (obj) {
    callback(obj);
  });
}

exports.run = run;
