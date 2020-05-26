require('./utils/env').checkEnv();
const ping = require('./utils/ping');
const { initDatabase, writePing } = require('./database');
const { fetchHosts } = require('./host');
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

    initApi(database, hosts);

    hosts.forEach(async (host) => {
      const res = await ping(host.ip);

      writePing(database, host.name, host.ip, res.duration, res.ttl);
    });
  } catch (err) {
    log.error(err);
  }
})();
