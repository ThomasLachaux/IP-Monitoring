require('dotenv').config();
const log = require('./log');

const environmentVariables = ['DATABASE_NAME', 'DATABASE_HOST', 'DATABASE_PORT', 'HOST_POOL_URL', 'API_PORT'];

const checkEnv = () => {
  environmentVariables.forEach((variable) => {
    if (process.env[variable] === undefined) {
      log.error(`${variable} is not defined !`);
      process.exit(1);
    }
  });
};

module.exports = { checkEnv };
