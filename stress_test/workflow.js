const Mocha = require('mocha');
const jsreporter = require('../src/reporters/json-reporter');
const assert = require('assert');

function passtest(user){
  assert.equal(1, 1);
}

function failtest(user){
  assert.equal(0, 1);
}

function run(workflow_id, user_id, problem_id, callback){
  let mocha = new Mocha({reporter: jsreporter});
  let test = new Mocha.Test('Running test', passtest.bind(this, user_id));
  let test2 = new Mocha.Test('Failing test', failtest.bind(this, user_id));
  let suite = new Mocha.Suite('Running suite');
  let sub_suite = new Mocha.Suite('Running sub suite', suite);
  sub_suite.addTest(test);
  sub_suite.addTest(test2);
  suite.addSuite(sub_suite);
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
