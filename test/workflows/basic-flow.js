const config = require('config');
const ChildProcess = require('child_process');
const assert = require('assert');
const expect = require('expect.js');
const { UserProfile, Problem, Schedule, UserCommitment } = require('../../src/models');

let userId, userModel, activeEntries, activeProblems;

describe('The following sequence of steps are taken, for example, for a user in the Bard group\n\n  Basic Flow (steps B1 - B8)', function() {
  
  before(function(done) {
    UserProfile.query({'byConditionLabel': 'bard'})
      .then(_users => {
        userId = _users.find(u=>u.get('userName')==='user-1005').get('id');
        done();
      })
    ;
  });

  // Step B1 -----
  describe('#(B1) Get the identity of a user', function() {

    it('should find and return user by Id', function(done) {
      UserProfile.findRecord(userId)
        .then(_userModel => {
          userModel = _userModel;
          done();
        })
        .catch(e => {
          done(e) 
        })
      ;
    });

    it('should confirm identity of the user', function() {
      let userName = userModel.get('userName');
      assert(userName === 'user-1005');
    });

  });

  // Step B2 -----
  describe('#(B2) Determine if user belongs to a choice or non-choice condition', function() {
    
    it('should belong to condition \'bard\'', function() {
      assert.equal(userModel.get('conditionLabel'), 'bard');
    });

    it('should not belong to a \'choice\' condition', function() {
      assert.notEqual(userModel.get('conditionLabel'), 'choice');
    });

  });

  // Step B3 -------
  describe('#(B3) Notify T&E system of user activity', function() {
    
    it(`should successfully set last active`, function() {
      let conditionLabel = userModel.get('conditionLabel');
      let lastActive = `lastActive.${conditionLabel}`;
      const timestamp = Date.now();

      userModel.set(lastActive, timestamp);
      assert.equal(userModel.get(lastActive), timestamp);
    });

    it('should successfully save user activity', function(done) {
      let conditionLabel = userModel.get('conditionLabel');
      let timestamp = userModel.get(`lastActive.${conditionLabel}`);

      userModel.save()
        .then(res => {
          return UserProfile.findRecord(userId);
        })
        .then(userdata => {
          assert(userdata.get(`lastActive.${conditionLabel}`), timestamp);
        })
        .then(done)
        .catch(e => {
          done(e);
        })
      ;
    });
  });

  // Step B4 -------------
  describe(`#(B4) Get the active problems for user`, function(done) {
    it(`should return list of all active problems and schedule entries`, function(done) {
      let problems = Problem.query({byUserId: userId})
        .then(active => {
          activeProblems = active;
          expect(active).to.be.an('array');
          done();
        })
        .catch(e => done(e));
    });

    it(`should return list of all active schedule entries`, function(done) {
      let schedule_entries = Schedule.query({byUserId: userId})
        .then(entries => {
          activeEntries = entries;
          expect(entries).to.be.an('array');
          done();
        })
        .catch(e=>done(e))
      ;
    });
  });

  // Step B5 ------------
  describe(`#(B5) Determine if in train/practice/test phase`, function() {
    it(`should have exactly one problemLabel active for a list of schedule entries`, function() {
      let problem = '___INIT___';
      let exactlyOneActive = activeEntries.reduce((bool, entry) => {
        let isSame = (problem === entry.get('problemLabel') || problem === '___INIT___');
        problem = entry.get('problemLabel');
        return bool & isSame;
      }, true);
      assert(exactlyOneActive);
    });

    it(`should have exactly one mode phase active for list of schedule entries`, function() {
      let mode = '___INIT___';
      let exactlyOneActive = activeEntries.reduce((bool, entry) => {
        let isSame = (mode === entry.get('mode') || mode === '___INIT___');
        mode = entry.get('mode');
        return bool & isSame;
      }, true);
      assert(exactlyOneActive);
    });
  });

  // Step B6 ---------------
  describe(`#(B6) Download the problem if needed`, function() {
    let testProblem;

    it(`should filter actual problems to present to the user`, function() {
      let filteredSet = activeProblems.filter(p=>!/(__.*__)/gi.test(p.get('problemLabel')));
      expect(filteredSet).to.be.an('array');
      if (filteredSet.length) {
        testProblem = filteredSet[0];
      }
    });

    it(`should download zipfile if exists`, function(done) {
      if (testProblem) {
        testProblem.get('zipfile')
          .then(file => {
            done();
          })
          .catch(e =>done(e))
        ;
      } else {
        done();
      }
    });
  });

  // Step B7 -----------
  describe(`#(B7) Notify T&E system of user commitment to problem`, function() {
    it(`should successfully save commitment`, function(done) {
      let userCommitment = new UserCommitment({
        userProfileId: userId,
        problemLabel: '__test__',
        systemLabel: '*'
      });
      userCommitment.save().then(()=>{done()}).catch(e=>done(e));
    });
  });

  // Step B8 -----------
  describe(`#(B8) Validate report to upload`, function() {
    it(`should validate the report using T&E provided script`, function(done) {
      const spawn = ChildProcess.spawn;
      const process = spawn('python', ["createapi_validate_zip.py", "report_artfuldeception_johndoe145.zip", "iarpacreate-v1-0.xsd"]);
      process.stdout.on('data', ()=>{done()});
      process.stderr.on('data', data=>done(data));
    });
  }); 
});