const assert = require('assert');
const expect = require('expect.js');
const _ = require('lodash');
const fileType = require('file-type');
const { Problem, UserProfile } = require('../../src/models');

let entryId, problemLabel;

describe('Test all /api/problem/ endpoints', () => {

  // -----------
  describe('#/api/problem/get', () => {
    let response;

    it('should return status 200 OK', done => {
      Problem.findAll()
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
      expect(entry).to.be.a(Problem);
      entryId = entry.get('id');
    });
  });

  // -------------
  describe('#/api/problem/get/{problem-id}', () => {
    let response;

    it('should return status 200 OK', done => {
      Problem.findRecord(entryId)
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a problem entry', () => {
      expect(response).to.be.a(Problem);
      let entryData = response.data;
      expect(entryData).to.have.property('label');
      problemLabel = entryData.label;
    });

  });

  // ----
  describe('#/api/problem/get/byLabel/{problem-label}', () => {
    let response;

    it('should return status 200 OK', done => {
      Problem.query({byLabel: problemLabel})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a problem entry', () => {
      expect(response).to.be.an('array');
      expect(response[0]).to.be.a(Problem);
    });

    it('should have entry for the given label', function() {
      let eData = response[0].data;
      expect(eData).to.have.property('label');
      assert.equal(eData.label, problemLabel);
    });

  });

  // ----
  describe('#/api/problem/get/byUserProfile', () => {
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
      Problem.query({byUserId: userId})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should have returned a list of problem entries', () => {
      expect(response).to.be.an('array');
    });

  });

    // ----
    describe('#/api/problem/get/byUserProfile/Time', () => {
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
            Problem.query({byUserIdTime: { userId: userId, timestamp: Date.now() }})
                .then(_response => {
                    response=_response;
                    done();
                })
                .catch(e=>done(e))
            ;
        });

        it('should have returned a list of problem entries', () => {
            expect(response).to.be.an(Array);
        });

    });

  describe('#/api/problem/download', function(){
    let response, zipFileId;

    //Find a zipFileId to test with
    before(function(done){
      Problem.findAll()
        .then(_problems => {
          zipFileId = _problems[0].get('zipFileId');
          done();
        })
        .catch(e => done(e));
    });

    it('should return status 200 OK', function(done){
        Problem.download(zipFileId)
          .then(_response => {
            response = _response;
            done();
          })
          .catch(e => done(e));
    });

    it('should return a zip archive', function(){
      let checkFileType = fileType(Buffer.from(response, 'binary'));

      assert(checkFileType.mime === 'application/zip');
    });
  });

});