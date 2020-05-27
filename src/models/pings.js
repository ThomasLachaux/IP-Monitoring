const { NotFoundError } = require('../utils/errors');
const { query } = require('../database');

const measurement = 'pings';

/**
 * Adds a ping value
 * @async
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
 * @async
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
 * @async
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

module.exports = { writePing, getPings, getSummaryPings };
