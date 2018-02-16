const Mocha = require('mocha');
const jsreporter = require('../src/reporters/json-reporter');
const assert = require('assert');

function mytest(user){
  assert.equal(1, 1);
  // console.log(`User ${user}`);
}

function run(workflow_id, user_id, problem_id, callback){
  let mocha = new Mocha({reporter: jsreporter});
  let test = new Mocha.Test('Running test', mytest.bind(this, user_id));
  let suite = new Mocha.Suite('Running suite', );
  suite.addTest(test);
  mocha.suite = suite;
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
