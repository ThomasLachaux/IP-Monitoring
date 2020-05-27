const { query } = require('../database');

const measurement = 'hosts';

/**
 * Adds a host value
 * @async
 * @param {InfluxDB} database influxdb database
 * @param {String} host host name
 * @param {String} ip host ip
 * @param {Boolean} available
 */
const writeHost = (database, host, ip, available) => {
  return database.writePoints([
    {
      measurement,
      tags: { host, ip },
      fields: { available },
    },
  ]);
};

/**
 * Returns host last state (available or not)
 * If the host doesn't exist, then the host is available
 * @async
 * @param {InfluxDB} database influxdb database
 * @param {String} host host name
 * @param {String} ip host ip
 */
const isHostMarkedAvailable = async (database, host, ip) => {
  const select = `SELECT LAST("available") AS "available" FROM ${measurement} WHERE "ip" = '${ip}'`;
  let response = await query(database, select);

  // If the host doesn't exists in the database
  if (response.length === 0) {
    await writeHost(database, host, ip, true);
    response = await query(database, select);
  }

  return response[0].available;
};

module.exports = { writeHost, isHostMarkedAvailable };
