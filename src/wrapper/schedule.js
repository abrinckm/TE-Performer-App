const BaseWrapper = require('./base-wrapper');
const Promise = require('bluebird');

class ScheduleWrapper extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/schedule';
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

  getByEntryId(id) {
    return this._get(`/get/${id}`);
  }  

  listByContext(condition, block) {
    // Must at least have condition
    if (!condition) {
      const error = 'ScheduleWrapper.listByContext() expects a condition-label; none given.';
      return new Promise((resolve, reject) => reject(error));
    }
    
    let url = `/get/byContext/${condition}`;
    if (block) {
      url += `/${block}`;
    }

    return this._get(url);
  }

  listActiveScheduleEntriesByUserId(userId) {
    return this._get(`/get/active/byUserProfile/${userId}`);
  }

  listActiveScheduleEntriesByUserIdTime(userId, timestamp) {
    return this._get(`/get/active/byUserProfile/${userId}/${timestamp}`);
  }
}

module.exports = ScheduleWrapper;