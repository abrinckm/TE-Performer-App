const BaseModel = require('./base-model');
const Promise = require('bluebird');
const bunyan = require('bunyan');
const _ = require('lodash');
const { UserProfileWrapper } = require('../wrapper');

const logger = bunyan.createLogger({
  "name": "UserProfile",
  "streams": [{
      "level": "info",
      "stream": process.stdout
    }, {
      "level": "error",
      "stream": process.stderr
  }]
});

class UserAttributes extends BaseModel {

  constructor(params) {
    super(params);

    this.data = {
      id: null,
      userProfileId: null,
      attributes: null
    };
    
    const self = this;
    const data = params.data ? params.data : params;
    Object.keys(data).forEach(attr => {
      if (_.has(self.data, attr)) { 
        self.data[attr] = params[attr]; 
      }
    });
  }

  /*
  Find record will return a single record by id
  @params id {string} 
  */
  static findRecord(id) {
    const wrapper = new UserProfileWrapper();
    return wrapper.getAttributesByUserId(id)
      .then(userdata => {
        return new UserAttributes(userdata);
      })
    ;
  }

  get(attr) {
    return _.get(this.data, attr);
  }

  set(attr, val) {
    return _.set(this.data, attr, val);
  }
}

module.exports = UserAttributes;