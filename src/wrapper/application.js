const BaseWrapper = require('./base-wrapper');

class Application extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/application';
  }

  getVersion() {
   
  }
}

module.exports = Application;