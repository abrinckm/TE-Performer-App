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

module.exports = logger;