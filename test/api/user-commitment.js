const assert = require('assert');
const expect = require('expect.js');
const _ = require('lodash');
const { UserCommitment, UserProfile } = require('../../src/models');

let entryId, userId, problemLabel, systemLabel;

describe('Test all /api/userCommitment/ endpoints', () => {

  before(done => {
    // Keep trying all labels until we find entries for user commitment
    UserCommitment.query({bySystemLabel:'coarg'})
      .then(entries => {
        const entry = entries[0];
        entryId = entry.get('id');
        userId = entry.get('userProfileId');
        problemLabel = entry.get('problemLabel');
        systemLabel = entry.get('systemLabel');
        done();
      })
      .catch(e=>done(e))
    ;
  });

  // -----------
  describe('#/api/userCommitment/get/{id}', () => {
    let response;

    it('should return status 200 OK', done => {
      UserCommitment.findRecord(entryId)
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return a user commitment', () => {
      expect(response).to.be.a(UserCommitment);
    });

  });

  // -------------
  describe('#/api/userCommitment/get/bySystemLabel/{system-label}', () => {
    let response;

    it('should return status 200 OK', done => {
      UserCommitment.query({bySystemLabel:systemLabel})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return an array of user commitments', () => {
      expect(response).to.be.an('array');
      let entry = response[0];
      expect(entry).to.be.a(UserCommitment);
    });
  
    it('should only have entries for the given system label', () => {
      response.forEach(entry => {
        let sysLabel = entry.get('systemLabel');
        assert.equal(sysLabel, systemLabel);
      });
    });

  });

  // -----------
  describe('#/api/UserCommitment/get/byProfileId/{profile-id}', () => {
    let response;

    it('should return status 200 OK', done => {
      UserCommitment.query({byProfileId: {userProfileId: userId}})
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return an array of user commitements', () => {
      expect(response).to.be.an('array');
      let entry = response[0];
      expect(entry).to.be.a(UserCommitment);
    });

    it('should only have entries for the given profile id', () => {
      response.forEach(entry => {
        let id = entry.get('userProfileId');
        assert.equal(id, userId);
      });
    });

  }); 

  // -------------
  describe('#/api/userCommitment/get/byProfileId/{profile-id}/{problem-label}/{system-label}', () => {
    let response;

    it('should return status 200 OK', done => {
      UserCommitment.query({
          byProfileId: {
            userProfileId: userId,
            problemLabel: problemLabel,
            systemLabel: systemLabel
          }
        })
        .then(_response => {
          response=_response;
          done();
        })
        .catch(e=>done(e))
      ;
    });

    it('should return an array of user commitments', () => {
      expect(response).to.be.an('array');
      let entry = response[0];
      expect(entry).to.be.a(UserCommitment);
    });

  });

  // --------------
  describe('#/api/userCommitment/add/{profile-id}/{problem-label}/{system-label}', () => {
    let response;

    it('should return status 200 OK', done => {
      const userCommitment = new UserCommitment({
        userProfileId: userId,
        problemLabel: 'test-problem',
        systemLabel: 'coarg'
      });

      userCommitment.save()
        .then(_response => {
          response=_response;
          done();
        })
      ;
    });

    it('should have saved given parameters', () => {
      expect(response).to.have.property('userProfileId');
      expect(response).to.have.property('problemLabel');
      expect(response).to.have.property('systemLabel');
      const { userProfileId, problemLabel, systemLabel } = response;
      assert.equal(userProfileId, userId);
      assert.equal(problemLabel, 'test-problem');
      assert.equal(systemLabel, 'coarg');
    });
    
  });

});
