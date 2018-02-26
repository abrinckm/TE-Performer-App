const Mocha = require('mocha');
const jsreporter = require('../src/reporters/json-reporter');
const assert = require('assert');
const { UserProfile } = require('../src/models');

let user_model;

function passtest(user){
  assert.equal(1, 1);
}

function failtest(user){
  assert.equal(0, 1);
}

function find_user(user_id, done){
  UserProfile.findRecord(user_id)
    .then(_userModel => {
      user_model = _userModel;
      done();
    })
    .catch(e => {
      done(e)
    });
}

function confirm_user(user_model) {
  let userName = user_model.get('userName');
  assert(userName === 'test-bard-4');
}

function run(api_key, workflow_id, user_id, problem_id, callback){
  let mocha = new Mocha({reporter: jsreporter});
  // let test = new Mocha.Test('Running test', passtest.bind(this, user_id));
  // let test2 = new Mocha.Test('Failing test', failtest.bind(this, user_id));
  let test = new Mocha.Test('should find and return user by Id', find_user.bind(this, '5a9178ffc9e77c0005bf5aaa'));
  let test2 = new Mocha.Test('should confirm identity of the user', confirm_user.bind(this, user_model));
  let suite = new Mocha.Suite('Running Basic Flow (steps B1 - B8)');
  let sub_suite = new Mocha.Suite('#(B1) Get the identity of a user', suite);
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
