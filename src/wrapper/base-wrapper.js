const config = require('config');

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
}

module.exports = BaseWrapper;