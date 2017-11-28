const mocha = require('mocha');
const fs = require('fs');
const config = require('config');
const Application = require('../wrapper/application');
const logger = require('../../logger');

const app = new Application({logger});

class CSVReporter extends mocha.reporters.Base {
  constructor(runner) {
    super(runner);

    this.passes = 0;
    this.failures = 0;
    this.endpoint = '';

    this.wStream = null;
    this.output = '';
    this.buffer = Buffer.alloc(0);

    runner.on('start', this._start.bind(this)); 
    runner.on('suite', this._suite.bind(this));
    runner.on('pass', this._pass.bind(this));
    runner.on('fail', this._fail.bind(this));
    runner.on('end', this._end.bind(this));
  }

  _start() {  
    const reporter = this;
    logger.info(`Environment is: ${process.env.NODE_ENV}`);
    logger.info(`Testing against API: ${config.get('apiUrl')}`);
    logger.info("Getting latest API version...");
    app.getVersion()
      .then(_version => {
        logger.info(`API version is: ${_version}`);
        logger.info(`Generating CSV...`);
        let now = new Date();
        let date = `${now.getMonth()}-${now.getDate()}`;
        reporter.output = `results_${_version}_${date}.csv`;
        reporter.wStream = fs.createWriteStream(reporter.output);
      })
      .catch(e => {
        logger.error(e);
      })
    ;
  }

  _suite(suite) {
    this.endpoint = suite.title.replace(/[^a-zA-Z/0-9&=.]/g, '');
  }

  _pass(test) {
    this.passes++;
    this._bufferLine(test.title, test.state);
  }

  _fail(test, err) {
    this.failures++;
    let apiErr = /(4\d{2}|500) - (.*)/.exec(err);
    if (apiErr) {
      let status = apiErr[1];
      let response = apiErr[2];
      // Set default message
      let json = {message: '', error: err};
      try {
        json = JSON.parse(response);
        try { // CBR API sometimes double wraps json messages...
          json = JSON.parse(json);
        }
        catch(e) {}
      }
      catch(e) {
        // Couldn't parse message
      }
      err = `Error: API responded with status ${status}: (${json.error}) ${json.message}`;
    } 
    this._bufferLine(test.title, test.state, err);  
  }

  _bufferLine(test, state, err) {
    err = err || 'null';
    test = this._clean(String(test));
    state = this._clean(String(state));
    err = this._clean(String(err));
    let data = `${state},${this.endpoint},${test},${err}\n`;
    let oldBuf = this.buffer;
    let newBuf = Buffer.from(data);
    this.buffer = Buffer.concat([oldBuf, newBuf]);
    this._write();
  }

  // Strip out all commas
  _clean(str) {
    return str.replace(/,/g, ';');
  }

  _write() {
    if (this.wStream === null || this.isDraining || this.buffer.length === 0) { return; }
    let writeBuf = Buffer.from(this.buffer);
    let ok = this.wStream.write(writeBuf);
    this.buffer = Buffer.alloc(0);
    if (!ok) {
      this.isDraining = true;
      this.wStream.once('drain', this._drain.bind(this));
    }
  }

  _drain() {
    this.isDraining = false;
    this._write();
  }

  _end() {
    let total = this.passes + this.failures;
    do {
      this._write();
    } while(this.buffer.length > 0);
    logger.info(`Test results written to file: ${this.output}`);
    this.wStream.end();
    process.exit(this.failures);
  }
}

module.exports = CSVReporter;