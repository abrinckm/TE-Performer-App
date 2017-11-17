const config = require('config');
const bunyan = require('bunyan');
const { Application } = require('./src/wrapper');

const logger = bunyan.createLogger({
  "name": "TEDummyApp",
  "streams": [
    {
      "level": "info",
      "stream": process.stdout
    },
    {
      "level": "error",
      "stream": process.stderr
    }
  ]
});

let app = new Application({logger});
app.getVersion();

let apiUrl = config.get('apiUrl');

logger.info(`Environment is ${process.env.NODE_ENV}`);
logger.info(`Using API ${apiUrl}`);

