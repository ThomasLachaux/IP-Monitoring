const Influx = require('influx');
const { NotFoundError } = require('./utils/errors');
const log = require('./utils/log');

// The database only uses one table
const measurement = 'pings';

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

/**
 * Adds a ping value
 * @param {InfluxDB} database influxdb database
 * @param {String} host host name
 * @param {String} ip host ip
 * @param {Number} duration host duration in ms. -1 if the host didn't respond
 * @param {Number} ttl ttl. -1 if the host didn't respond
 */
const writePing = (database, host, ip, duration, ttl) => {
  return database.writePoints([
    {
      measurement,
      tags: { host, ip },
      fields: { duration, ttl },
    },
  ]);
};

/**
 * Fetch all the values from an ip
 * @param {InfluxDB} database influxdb database
 * @param {String} ip host ip
 */
const getPings = async (database, ip) => {
  const select = `SELECT *
    FROM ${measurement}
    WHERE "ip" = '${ip}'
    GROUP BY "host","ip"`;

  // format: [{time, duration, host, ip, ttl}]
  const response = await query(database, select);

  if (response.length === 0) {
    throw new NotFoundError('The IP could not be found');
  }

  return response;
};

/**
 * Get global stats (total, average duration, average ttl) from an ip
 * @param {InfluxDB} database influxdb database
 * @param {String} ip host ip
 */
const getSummaryPings = async (database, ip) => {
  const select = `SELECT COUNT("duration"), MEAN("duration") AS "meanDuration", MEAN("ttl") AS "meanTtl"
    FROM ${measurement}
    WHERE "ip" = '${ip}' AND "duration" != -1 AND "ttl" != -1
    GROUP BY "host","ip"`;

  // format: [{time, duration, host, ip, ttl}]
  const response = await query(database, select);

  if (response.length === 0) {
    throw new NotFoundError('The IP could not be found or has no successful records');
  }

  const summary = response[0];
  delete summary.time;

  return summary;
};

module.exports = { initDatabase, writePing, getPings, getSummaryPings };
