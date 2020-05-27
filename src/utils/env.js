require('dotenv').config();
const log = require('./log');

const requiredEnvironmentVariables = [
  'HOST_POOL_URL',
  'API_PORT',
  'PING_INTERVAL',
  'FETCH_HOST_INTERVAL',
  'ALERT_HOST_DOWN_AFTER',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_USER',
  'MAIL_PASSWORD',
  'MAIL_SENDER',
  'MAIL_RECEIVER',
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
