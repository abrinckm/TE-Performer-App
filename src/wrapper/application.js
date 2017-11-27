const BaseWrapper = require('./base-wrapper');

class Application extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/application';
  }

  getVersion() {
    const app = this;
    return this.get('/get')
      .then(response => {
        let api_version = JSON.parse(response).version;
        return api_version;
      })
      .catch(e => {
        app.logger.error(e);
      })
    ;
  }
}

module.exports = Application;