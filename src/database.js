const Influx = require('influx');
const { NotFoundError } = require('./utils/errors');

// todo: centraliser
const measurement = 'ips';

const databaseName = () => {
  if (!process.env.DATABASE_NAME) {
    console.log('DATABASE_NAME environment variable missing');
    process.exit(1);
  }

  return process.env.DATABASE_NAME;
};

const initDatabase = async () => {
  const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: databaseName(),
    port: 8086,
  });

  const databases = await influx.getDatabaseNames();

  if (!databases.includes(databaseName())) {
    console.log(`Create database ${databaseName()}`);
    await influx.createDatabase(databaseName());
  }

  return influx;
};

const writePing = (database, host, ip, duration) => {
  return database.writePoints([
    {
      measurement,
      tags: { host, ip },
      fields: { duration },
      timestamp: new Date().getTime(),
    },
  ]);
};

const getPings = async (database, ip) => {
  const query = `SELECT * FROM ${measurement} WHERE ip = '${ip}'`;
  console.log(query);

  // format: [{time, duration, host, ip}]
  const response = await database.query(query);

  if (response.length === 0) {
    throw new NotFoundError('IP not found');
  }

  // format: {host, ip, pings: [time, duration]}
  return {
    host: response[0].host,
    ip: response[0].ip,
    pings: response.map((ping) => ({
      time: ping.time,
      duration: ping.duration,
    })),
  };
};

module.exports = { initDatabase, writePing, getPings };
