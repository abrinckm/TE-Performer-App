const assert = require('assert');
const expect = require('expect.js');
const _ = require('lodash');
const { UserProfile, UserAttributes } = require('../../src/models');

let userId;

describe('Test all /api/userProfile/ endpoints', function() {

  before(function(done) {
    // Find a user to test with...
    UserProfile.query({'byConditionLabel': 'bard'})
      .then(_users => {
        userId = _users[0].get('id');
        done();
      })
    ;
  });

  // ----
  describe('#/api/userProfile/get/byId', function() {
    let response;

    it('should return status 200 OK', function(done) {
      UserProfile.findRecord(userId)
        .then(_response => {
          response=_response;
          done()
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a user record', function() {
      assert(response instanceof UserProfile);
    });
  
  });

  // ----
  describe('#/api/userProfile/get/byIds', function() {
    let response, userModel;

    it('should return status 200 OK', function(done) {
      UserProfile.query({'byIds': [userId]})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a list of users', function() {
      assert(_.isArray(response));
      userModel = response[0];
      assert(userModel instanceof UserProfile);
    });

    it('should return only matching users', function() {
      assert(userModel.get('id'), userId);
    });

  });

  // ----
  describe('#/api/userProfile/get/byConditionLabel', function() {
    let response, userModel;

    it('should return status 200 OK', function(done) {
      UserProfile.query({'byConditionLabel': 'bard'})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a list of users', function() {
      expect(response).to.be.an('array');  
      expect(response).to.not.be.empty();
      userModel = response[0];
      assert(userModel instanceof UserProfile);
    });

    it('should return users belonging to condition', function() {
      expect(userModel).to.not.be.empty();
      assert(userModel.get('conditionLabel'), 'bard');
    });

  });

  // ----
  describe('#/api/userProfile/get/byContext/', function() {
    let response, userModel;

    it('should return status 200 OK', function(done) {
      UserProfile.query({'byContext': {conditionLabel:'bard', blockLabel: '2'}})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a list of users', function() {
      expect(response).to.be.an('array');  
      expect(response).to.not.be.empty();
      userModel = response[0];
      assert(userModel instanceof UserProfile);
    });

    it('should return users within specified context', function() {
      expect(userModel).to.not.be.empty();
      assert(userModel.get('conditionLabel'), 'bard');
      assert(userModel.get('blockLabel'), '2');
    });

  });

  describe('#/api/userProfile/get/attributes/byUserProfileId/', function() {
    let response;

    it('should return status 200 OK', function(done) {
      UserAttributes.findRecord(userId)
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a record of user attributes', function() {
      assert(response instanceof UserAttributes);
      expect(response.get('attributes')).to.not.be.empty();
    });

  });

  describe('#/api/userProfile/set/lastActive/', function() {
    let userModel, timestamp;

    before(function(done) {
      UserProfile.findRecord(userId)
        .then(_userModel => {
          userModel=_userModel;
          userModel.set('lastActive', {});
          userModel.set('trainedOn', {});
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should be able to set lastActive on user model', function() {
      timestamp = Date.now();
      userModel.set('lastActive.bard', timestamp);
      assert(userModel.get('lastActive.bard', timestamp));
    });

    it('should return status 200 OK when saving \'lastActive\' state', function(done) {
      userModel.save().then(done).catch(e=>done(e));
    });

    it('should have successfully saved timestamps', function(done) {
      UserProfile.findRecord(userId)
        .then(_userModel => {
          let lastActive = _userModel.get('lastActive');
          expect(lastActive).to.not.be.empty();
          assert(lastActive.bard, timestamp);
          done();
        })
        .catch(e=>done(e))
      ;
    });

  });

  describe('#/api/userProfile/set/trained/', function() {
    let userModel, timestamp;

    before(function(done) {
      UserProfile.findRecord(userId)
        .then(_userModel => {
          userModel=_userModel;
          userModel.set('lastActive', {});
          userModel.set('trainedOn', {});
          done();
        })
        .catch(e=>done(e))
      ;
    });
    
    it('should be able to set trainedOn for user model', function() {
      userModel.set('trainedOn.bard', true);
      assert(userModel.get('trainedOn.bard'));
    });

    it('should return status 200 OK when saving \'trainedOn\' state', function(done) {
      userModel.save().then(done).catch(e=>done(e));
    }); 

    it('should have successfully saved \'trainedOn\' booleans', function(done) {
      UserProfile.findRecord(userId)
        .then(_userModel => {
          let trainedOn = _userModel.get('trainedOn');
          expect(trainedOn).to.not.be.empty();
          assert(trainedOn.bard);
          done();
        })
        .catch(e=>done(e))
      ;
    });
  })
});
