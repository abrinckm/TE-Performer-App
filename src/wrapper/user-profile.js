const BaseWrapper = require('./base-wrapper');

class UserProfileWrapper extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/userProfile';
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

  listAll() {
    return this._get('/get');
  }

  getByUserId(id) {
    return this._get(`/get/${id}`);
  }

  // Expect param `ids` to be a string array
  listByIds(ids) {
    return this._get(`/get/byIds/${ids.join(',')}`);
  }

  // param `condition` is [bard | choice | coarg | swarm | trace | ctrl_ind | ctrl_team]
  listByConditionLabel(condition) {
    return this._get(`/get/byConditionLabel/${condition}`);
  }

  listByContext(condition, block) {
    return this._get(`/get/byContext/${condition}/${block}`);
  }

  getByUserName(username) {
    return this._get(`/get/byUserName/${username}`);
  }

  getAttributesByUserId(id) {
    return this._get(`/get/attributes/byUserProfileId/${id}`);
  }

  listTrained(systemLabel) {
    return this._get(`/get/trained/${systemLabel}`);
  }

  listBySystem(systemLabel) {
    return this._get(`/get/bySystem/${systemLabel}`);
  }

  listActive(label, date) {
    return this._get(`/get/active/${label}/${date}`);
  }

  listByTeam(teamId) {
    return this._get(`/get/byTeam/${teamId}`);
  }

  updateTrained(profileId, sysLabel, trained) {
    return this._set(`/set/trained/${profileId}/${sysLabel}/${trained}`);
  }

  updateLastActive(profileId, systemLabel, timestamp) {
    return this._set(`/set/lastActive/${profileId}/${systemLabel}/${timestamp}`);
  }
}

module.exports = UserProfileWrapper;