const assert = require('assert');
const expect = require('expect.js');
const fileType = require('file-type');
const { Report } = require('../../src/models');

describe('Test all /api/report/ endpoints', function() {
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

    describe('#/api/report/get/byProblem', function(){
        let response;

        xit('should return status 200 OK', function(done){
            //TODO specify valid problem ID
            Report.query({ getByProblemId: { problemId: '5a139f37c9e77c00051f8927' }})
                .then(_response => {
                    response = _response;
                    done();
                })
                .catch(e => done(e));
        });

        xit('should return a list that contains a single report with the correct report ID', function(){
            expect(response).to.be.an(Array);
            expect(response[0]).to.be.a(Report);
            //TODO specify expected report ID
            assert(response[0].get('id') === '5a13a078c9e77c00051f8977');
        });
    });

    describe('#/api/report/download', function(){
        let response;

        it('should return status 200 OK', function(done){
            Report.download('5a13a078c9e77c00051f8978')
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

    describe('#/api/report/upload', function(){
        let response;

        it('should return status 200 OK', function(done){
            const newReport = new Report({});
            newReport.save('report_artfuldeception_johndoe145.zip')
                .then(_response => {
                   response = _response;
                   done();
                })
                .catch(e => done(e));
        });

        it('should have returned a confirmation message', function(){
            expect(response).to.have.property('message');
            assert.equal(response.message, 'file [report_artfuldeception_johndoe145.zip] uploaded successfully!');
        });
    });
});