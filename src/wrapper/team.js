const BaseWrapper = require('./base-wrapper');

class TeamWrapper extends BaseWrapper {
    constructor(params) {
        super(params);
        this.apiUrl += '/team';
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

    getByIds(idArray) {
        return this._get(`/get/byIds/${idArray.join(',')}`);
    }

    getByConditionLabel(condition) {
        return this._get(`/get/byConditionLabel/${condition}`);
    }

    getByContext(condition, block) {
        return this._get(`/get/byContext/${condition}/${block}`);
    }

    getByProfileId(profileId) {
        return this._get(`/get/byProfileId/${profileId}`);
    }
}

module.exports = TeamWrapper;