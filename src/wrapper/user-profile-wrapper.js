const BaseWrapper = require('./base-wrapper');

class UserProfileWrapper extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/userProfile';
  }

  debug() {
    if (this.logger) {
      this.logger.info(`${this.apiUrl}  `);
    }
  }  
}

module.exports = UserProfileWrapper;