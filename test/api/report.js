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
});