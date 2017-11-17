const config = require('config');
const bunyan = require('bunyan');
const { Application, ScheduleWrapper } = require('./src/wrapper');

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

let schedules = new ScheduleWrapper({logger});
schedules.listAll();

let apiUrl = config.get('apiUrl');

logger.info(`Environment is ${process.env.NODE_ENV}`);
logger.info(`Using API ${apiUrl}`);

