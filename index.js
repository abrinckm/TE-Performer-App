const config = require('config');
const { Application } = require('./src/wrapper');
const logger = require('./logger');

let app = new Application({logger});
app.getVersion();

let apiUrl = config.get('apiUrl');

logger.info(`Environment is ${process.env.NODE_ENV}`);
logger.info(`Using API ${apiUrl}`);

