const Influx = require('influx');

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

const writePing = (database, host, duration) => {
  return database.writePoints([
    {
      measurement: 'ips',
      tags: { host },
      fields: { duration },
      timestamp: new Date().getTime(),
    },
  ]);
};

module.exports = { initDatabase, writePing };
