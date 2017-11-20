const BaseModel = require('./base-model');
const { UserProfileWrapper } = require('../wrapper');

class UserProfile extends BaseModel {
  constructor(params) {
    super(params);
    this.wrapper = new UserProfileWrapper(params);
  }

  query() {
    
  }
}

module.exports = UserProfile;