const config = require('config');
const bunyan = require('bunyan');

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

let apiUrl = config.get('apiUrl');

logger.info(`Environment is ${process.env.NODE_ENV}`);
logger.info(`Using API ${apiUrl}`);

