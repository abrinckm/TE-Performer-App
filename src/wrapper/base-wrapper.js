const config = require('config');
const request = require('request-promise');
const requestSync = require('sync-request');
const _ = require('lodash');
const fs = require('fs');

let apiCookieJar = null;
let apiKey = null;

class BaseWrapper {
  constructor(params) {
    const { logger } = params || {};
    this.logger = logger || 
    {
      info:(out)=>{console.log(out)},
      error:(out)=>{console.error(out)}
    };
    this.apiUrl = config.get('apiUrl');

    // Retrieve the API key token and save it as a cookie for subsequent requests
    if(!apiCookieJar) {
      /*
        Read username and password from file in root of project called creds.txt
        Username is first line and password on second line.
       */
      let lines = fs.readFileSync('creds.txt', 'utf-8').split('\n').filter(Boolean);
      let user = lines[0];
      let pass = lines[1];

      //Synchronous call to ensure it is run first
      let response = requestSync('POST', `${this.apiUrl}/auth/get/key/${user}/${pass}`);
      let cookies = response['headers']['set-cookie'].filter(apikey=>apikey.startsWith('ApiKey'));
      let tokens = cookies[0].split(';', 1);
      apiKey = tokens[0];
      apiCookieJar = request.jar();
      let cookie = request.cookie(apiKey);
      apiCookieJar.setCookie(cookie, this.apiUrl);
    }
  }

  static apiKey() {
    return apiKey;
  }

  // --------------------
  // A simple GET request
  get(path, options) {
    options = _.merge({
      headers: {
        'content-type': 'application/json'
      },
      jar: apiCookieJar,
    }, options || {});

    options.uri = `${this.apiUrl}${path}`;

    return request(options);
  }

  // -------------------
  // POST request
  post(path, body, options) {
    options = _.merge({
      headers: {'content-type':'application/json'},
      body: body,
      json: false,
      jar: apiCookieJar,
    }, options || {}, {
      method: 'POST'
    });
  
    options.uri = `${this.apiUrl}${path}`;

    return request(options);
  }
}

module.exports = BaseWrapper;
