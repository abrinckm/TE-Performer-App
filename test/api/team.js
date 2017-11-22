const assert = require('assert');
const expect = require('expect.js');
const { Team } = require('../../src/models');

describe('Test all /api/team/ endpoints', function() {

    describe('#/api/team/get', function(){
        let response;

        it('should return status 200 OK', function(done){
            Team.findAll()
                .then(_response => {
                    response=_response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a list of teams', function(){
            expect(response).to.be.an(Array);
            response.forEach(result => {
                expect(result).to.be.a(Team);
            });
        });
    });

    describe('#/api/team/get/byId', function(){
        let response, teamId;

        //Find a teamId to test with
        before(function(done){
            Team.query({ getByConditionLabel: { conditionLabel: 'bard' } })
                .then(_teams => {
                    teamId = _teams[0].get('id');
                    done();
                })
                .catch(e => done(e));
        });

        it('should return status 200 OK', function(done){
            Team.findRecord(teamId)
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a single team record with the specified team ID', function() {
            expect(response).to.be.a(Team);
            assert(response.get('id') === teamId);
        });
    });

    describe('#/api/team/get/byIds', function(){
        let response, teamIds;

        //Find a teamIds to test with
        before(function(done){
            Team.query({ getByConditionLabel: { conditionLabel: 'bard' } })
                .then(_teams => {
                    teamIds = [ _teams[0].get('id'), _teams[1].get('id') ];
                    done();
                })
                .catch(e => done(e));
        });

        it('should return status 200 OK', function(done){
            Team.query({ getByIds: teamIds })
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a list of teams with the specified team IDs', function(){
            expect(response).to.be.an(Array);
            response.forEach(result => {
                expect(result).to.be.a(Team);
                assert(teamIds.includes(result.get('id')));
            });
        });
    });

    describe('#/api/team/get/byConditionLabel', function(){
        let response;

        it('should return status 200 OK', function(done){
            Team.query({ getByConditionLabel: { conditionLabel: 'bard' }})
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a list of teams with the specified condition label', function () {
            expect(response).to.be.an('array');
            response.forEach(result => {
                expect(result).to.be.a(Team);
                assert(result.get('conditionLabel') === 'bard');
            });

        });
    });

    describe('#/api/team/get/byContext', function(){
        let response;

        it('should return status 200 OK', function(done){
            Team.query({ getByContext: { conditionLabel: 'bard', blockLabel: 3 }})
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a list of teams with the specified condition label and block label', function () {
            expect(response).to.be.an('array');
            response.forEach(result => {
                expect(result).to.be.a(Team);
                assert(result.get('conditionLabel') === 'bard');
                assert(result.get('blockLabel') === '3');
            });
        });
    });

    describe('#/api/team/get/byProfileId', function(){
        let response, userProfileId;

        //Find a teamId to test with
        before(function(done){
            Team.query({ getByConditionLabel: { conditionLabel: 'bard' } })
                .then(_teams => {
                    userProfileId = _teams[0].get('userProfileIds[0]');
                    done();
                })
                .catch(e => done(e));
        });

        it('should return status 200 OK', function(done){
            Team.query({ getByProfileId: { profileId: userProfileId }})
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a list of teams with the specified userProfileId', function () {
            expect(response).to.be.an(Array);
            response.forEach(result => {
                expect(result).to.be.a(Team);
                assert(result.get('userProfileIds').includes(userProfileId));
            });

        });
    });

});