const BaseWrapper = require('./base-wrapper');
const Promise = require('bluebird');

class ProblemWrapper extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/problem';
  }

  _get(uri) {
    return this.get(uri)
      .then(response => {
        return JSON.parse(response).data;
      })
    ;
  }

  listAll() {
    return this._get('/get');
  }

  getByProblemId(id) {
    return this._get(`/get/${id}`);
  }

  getProblemMetaByLabel(label) {
    return this._get(`/get/byLabel/${label}`);
  }

  listByUserId(userId) {
    return this._get(`/get/active/byUserProfile/${userId}`);
  }

  listByUserIdTime(userId, timestamp) {
      return this._get(`/get/active/byUserProfile/${userId}/${timestamp}`);
  }

  getProblemFile(fileId) {
    return this.get(`/download/${fileId}`).then(response => {
      return response;
    });
  }
} 

module.exports = ProblemWrapper;