const BaseWrapper = require('./base-wrapper');

class ReportWrapper extends BaseWrapper {
    constructor(params) {
        super(params);
        this.apiUrl += '/report';
    }

    _get(uri) {
        return this.get(uri)
            .then(response => {
                return JSON.parse(response).data;
            });
    }

    listAll() {
        return this._get('/get');
    }

    getById(id) {
        return this._get(`/get/${id}`);
    }

    getByProblemId(profileId) {
        return this._get(`/get/byProblem/${profileId}`);
    }

    getFile(fileId) {
        return this.get(`/download/${fileId}`)
            .then(response => {
                return response;
            });
    }
}

module.exports = ReportWrapper;