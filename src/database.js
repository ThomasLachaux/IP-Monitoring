const Influx = require('influx');
const log = require('./utils/log');

/**
 * Makes and logs a InfluxDB query
 * @param {InfluxDB} database influxdb database
 * @param {String} queryString influxdb query
 */
const query = (database, queryString) => {
  log.info(`[InfluxDB] ${queryString}`);
  return database.query(queryString);
};

/**
 * Connects to the database and create it if not exists
 * @async
 */
const initDatabase = async () => {
  const databaseName = process.env.INFLUXDB_DB;

  const influx = new Influx.InfluxDB({
    host: process.env.INFLUXDB_HOST,
    username: process.env.INFLUXDB_USER,
    password: process.env.INFLUXDB_USER_PASSWORD,
    database: databaseName,
    port: 8086,
  });

  const databases = await influx.getDatabaseNames();

  if (!databases.includes(databaseName)) {
    log.info(`Create database ${databaseName}`);
    await influx.createDatabase(databaseName);
  }

  return influx;
};

module.exports = { initDatabase, query };
