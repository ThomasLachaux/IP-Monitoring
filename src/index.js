require('./utils/env').checkEnv();
const { initDatabase } = require('./database');
const { fetchHosts, startPingInterval } = require('./utils/ping');
const { initApi } = require('./api');
const log = require('./utils/log');

// list des ip
const hosts = [
  {
    name: 'google-dns',
    ip: '8.8.8.8',
  },
  {
    name: '42',
    ip: '163.172.250.12',
  },
  {
    name: 'stationf',
    ip: '104.26.13.60',
  },
  {
    name: 'lol',
    ip: '192.168.1.214',
  },
];

(async () => {
  try {
    // const hosts = await fetchHosts();
    const database = await initDatabase();

    startPingInterval(hosts, database);
    initApi(database, hosts);
  } catch (err) {
    log.error(err);
  }
})();
