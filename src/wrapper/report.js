const BaseWrapper = require('./base-wrapper');
const fs = require('fs');

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

    create(path) {
        let options = {
            formData: {
                file: {
                    value: fs.createReadStream(path),
                    options: { contentType: 'application/x-zip-compressed' }
                }
            },
        };

        return this.post('/upload', null, options)
            .then(response => {
                return JSON.parse(response);
            });
    }
}

module.exports = ReportWrapper;