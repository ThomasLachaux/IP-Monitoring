const Influx = require('influx');
const { NotFoundError } = require('./utils/errors');
const log = require('./utils/log');

// todo: centraliser
const measurement = 'pings';

const query = (database, queryString) => {
  log.info(`[InfluxDB] ${queryString}`);
  return database.query(queryString);
};

const initDatabase = async () => {
  const databaseName = process.env.DATABASE_NAME;

  const influx = new Influx.InfluxDB({
    host: process.env.DATABASE_HOST,
    database: databaseName,
    port: process.env.DATABASE_PORT,
  });

  const databases = await influx.getDatabaseNames();

  if (!databases.includes(databaseName)) {
    log.info(`Create database ${databaseName}`);
    await influx.createDatabase(databaseName);
  }

  return influx;
};

const writePing = (database, host, ip, duration, ttl) => {
  return database.writePoints([
    {
      measurement,
      tags: { host, ip },
      fields: { duration, ttl },
    },
  ]);
};

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
