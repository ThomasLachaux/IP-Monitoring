require('dotenv').config();
const log = require('./log');

const requiredEnvironmentVariables = [
  'HOST_POOL_URL',
  'API_PORT',
  'PING_INTERVAL',
  'INFLUXDB_HOST',
  'INFLUXDB_DB',
  'INFLUXDB_USER',
  'INFLUXDB_USER_PASSWORD',
  'INFLUXDB_PORT',
];

/**
 * Checks if all the required environment variables are defined
 */
const checkEnv = () => {
  requiredEnvironmentVariables.forEach((variable) => {
    if (process.env[variable] === undefined) {
      log.error(`${variable} is not defined !`);
      process.exit(1);
    }
  });
};

module.exports = { checkEnv };
