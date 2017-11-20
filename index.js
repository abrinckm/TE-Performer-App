const config = require('config');
const bunyan = require('bunyan');
const { Application } = require('./src/wrapper');
const { UserProfile } = require('./src/models');


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

let userProfiles = new UserProfile({logger});
UserProfile.query({byIds:['5a0e603dc9e77c000cefd8aa','5a0e603dc9e77c000cefd8ad']})
// UserProfile.findRecord('5a0e603dc9e77c000cefd8aa')
  .then(users => {
    logger.info(users);
  })
  .catch(e => {
    logger.error(e);
  })
;

let apiUrl = config.get('apiUrl');

logger.info(`Environment is ${process.env.NODE_ENV}`);
logger.info(`Using API ${apiUrl}`);

