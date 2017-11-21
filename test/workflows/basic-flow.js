const config = require('config');

const assert = require('assert');
const { UserProfile } = require('../../src/models');

let userId, userModel;

describe('Basic Flow (steps B1 - B3)', function() {
  
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

  })

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
});