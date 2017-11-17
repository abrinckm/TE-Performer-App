const BaseWrapper = require('./base-wrapper');

class Application extends BaseWrapper {
  constructor(params) {
    super(params);
    this.apiUrl += '/application';
  }

  getVersion() {
    const app = this;
    this.get('/get')
      .then(response => {
        let api_version = JSON.parse(response).version;
        app.logger.info(`API Version is ${api_version}`);
      })
      .catch(e => {
        app.logger.error(e);
      })
    ;
  }
}

module.exports = Application;