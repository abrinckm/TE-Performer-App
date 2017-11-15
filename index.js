const config = require('config');

let apiUrl = config.get('apiUrl');

console.log(`Environment is ${process.env.NODE_ENV}`);
console.log(`Using API ${apiUrl}`);