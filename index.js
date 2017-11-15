const config = require('config');
const bunyan = require('bunyan');
const { UserProfileWrapper } = require('./src/wrapper');

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

let up = new UserProfileWrapper();
up.debug();

let apiUrl = config.get('apiUrl');

logger.info(`Environment is ${process.env.NODE_ENV}`);
logger.info(`Using API ${apiUrl}`);

