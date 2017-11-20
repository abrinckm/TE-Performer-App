const config = require('config');
const assert = require('assert');
const { UserProfile } = require('../src/models');

// an existing user id to test against (differs depending on which api we use)
const userId = config.get('env') === 'prod' ? '5a0ef457c9e77c000ccaaaaf' : '5a0e603dc9e77c000cefd8aa';

describe('Basic Flow (steps B1 - B3)', function() {
  let userModel;

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
        });
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
    
    it(`should successfully set last active for condition`, function() {
      let conditionLabel = userModel.get('conditionLabel');
      let lastActive = `lastActive.${conditionLabel}`;
      const timestamp = Date.now();
      userModel.set(lastActive, timestamp);
      assert.equal(userModel.get(lastActive), timestamp);
    });
  });
});