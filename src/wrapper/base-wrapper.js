const config = require('config');
const request = require('request-promise');
const _ = require('lodash');

class BaseWrapper {
  constructor(params) {
    const { logger } = params || {};
    this.logger = logger || 
    {
      info:(out)=>{console.log(out)},
      error:(out)=>{console.error(out)}
    }
    this.apiUrl = config.get('apiUrl');
  }   

  // --------------------
  // A simple GET request
  get(path, options) {
    options = _.merge({
      headers: {
        'content-type': 'application/json'
      }
    }, options || {});

    options.uri = `${this.apiUrl}${path}`;

    return request(options);
  }
}

module.exports = BaseWrapper;