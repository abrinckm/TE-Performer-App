const BaseWrapper = require('./base-wrapper');

class UserCommitmentWrapper extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/userCommitment';
  } 

  _get(uri) {
    return this.get(uri)
      .then(response => {
        return JSON.parse(response).data;
      })
    ;
  } 

  _set(uri) {
    return this.post(uri)
      .then(response => {
        return JSON.parse(response).data;
      })
    ;
  }

  getByCommitmentId(id) {
    return this._get(`/get/${id}`);
  }

  listByProfileId(userId, problemLabel, sysLabel) {
    if (!problemLabel || !sysLabel) {
      return this._get(`/get/byProfileId/${userId}`);
    }
    return this._get(`/get/byProfileId/${userId}/${problemLabel}/${sysLabel}`);
  }

  listBySystemLabel(sysLabel) {
    return this._get(`/get/bySystemLabel/${sysLabel}`);
  }

  create(userId, problemLabel, sysLabel) {
    return this._set(`/add/${userId}/${problemLabel}/${sysLabel}`);
  }

}

module.exports = UserCommitmentWrapper;