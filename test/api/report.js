const assert = require('assert');
const expect = require('expect.js');
const { Report } = require('../../src/models');

describe('Test all /api/team/ endpoints', function() {
    describe('#/api/report/get', function(){
        let response;

        it('should return status 200 OK', function(done){
            Report.findAll()
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a list of reports', function(){
            expect(response).to.be.an(Array);
            response.forEach(result => {
                expect(result).to.be.a(Report);
            });
        });
    });

    describe('#/api/report/get/byId', function(){
        let response, reportId;

        //Find a reportId to test with
        before(function(done){
            Report.findAll()
                .then(_reports => {
                    reportId = _reports[0].get('id');
                    done();
                })
                .catch(e => done(e));
        });

        it('should return status 200 OK', function(done){
            Report.findRecord(reportId)
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        it('should return a single report with the specified report ID', function(){
            expect(response).to.be.a(Report);
            assert(response.get('id') === reportId);
        });
    });
});