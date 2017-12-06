const assert = require('assert');
const expect = require('expect.js');
const _ = require('lodash');
const { Schedule, UserProfile } = require('../../src/models');

let entryId, conditionLabel, blockLabel;

describe('Test all /api/schedule/ endpoints', () => {

  // -----------
  describe('#/api/schedule/get', () => {
    let response;

    it('should return status 200 OK', done => {
      Schedule.findAll()
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a list of entries', () => {
      expect(response).to.be.an('array');
      expect(response).to.not.be.empty();
      let entry = response[0];
      expect(entry).to.be.a(Schedule);
      entryId = entry.get('id');
    });
  });

  // -------------
  describe('#/api/schedule/get/byId', () => {
    let response;

    it('should return status 200 OK', done => {
      Schedule.findRecord(entryId)
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a schedule entry', () => {
      expect(response).to.be.a(Schedule);
      let entryData = response.data;
      expect(entryData).to.have.property('conditionLabel');
      expect(entryData).to.have.property('blockLabel');
      conditionLabel = entryData.conditionLabel;
      blockLabel = entryData.blockLabel;
    });

  });

  // ----
  describe('#/api/schedule/get/byContext/{conditionLabel}', () => {
    let response;

    it('should return status 200 OK', done => {
      Schedule.query({byContext: {conditionLabel:conditionLabel}})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a list of schedule entries', () => {
      expect(response).to.be.an('array');  
      expect(response).to.not.be.empty();
      let entry = response[0];
      expect(entry).to.be.a(Schedule);
    });

    it('should have entries of the given conditionLabel', function() {
      response.forEach(entry => {
        let eData = entry.data;
        expect(eData).to.have.property('conditionLabel');
        assert.equal(eData.conditionLabel, conditionLabel);
      });
    });

  });

  // ----
  describe('#/api/schedule/get/byContext/{conditionLabel}/{blockLabel}', () => {
    let response;

    it('should return status 200 OK', done => {
      Schedule.query({
        byContext: {
          conditionLabel:conditionLabel,
          blockLabel: blockLabel
          }
        })
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a list of schedule entries', () => {
      expect(response).to.be.an('array');  
      expect(response).to.not.be.empty();
      let entry = response[0];
      expect(entry).to.be.a(Schedule);
    });

    it('should have entries of the given blockLabel', function() {
      response.forEach(entry => {
        let eData = entry.data;
        expect(eData).to.have.property('blockLabel');
        assert.equal(eData.blockLabel, blockLabel);
      });
    });

  });

  // ----
  describe('#/api/schedule/get/active/byUserProfile', () => {
    let response, userId;

    before(function(done) {
      // Find a user to test with...
      UserProfile.query({'byConditionLabel': 'bard'})
        .then(_users => {
          userId=_users[0].get('id');
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return status 200 OK', done => {
      Schedule.query({byUserId: userId})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a list of schedule entries', () => {
      expect(response).to.be.an('array');
    });

  });

    // ----
    describe('#/api/schedule/get/active/byUserProfile/Time', () => {
        let response, userId;

        before(function(done) {
            // Find a user to test with...
            UserProfile.query({'byConditionLabel': 'bard'})
                .then(_users => {
                    userId=_users[0].get('id');
                    done();
                })
                .catch(e=>done(e))
            ;
        });

        it('should return status 200 OK', done => {
            Schedule.query({byUserIdTime: { userId: userId, timestamp: Date.now() }})
                .then(_response => {
                    response=_response;
                    done();
                })
                .catch(e=>done(e))
            ;
        });

        it('should have returned a list of schedule entries', () => {
            expect(response).to.be.an('array');
        });

    });

});