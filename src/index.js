require('dotenv').config();
const ping = require('ping');
const { initDatabase, writePing } = require('./database');

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
    const database = await initDatabase();

    writePing(database, 'test', 0.7);

    hosts.forEach(async (host) => {
      const res = await ping.promise.probe(host.ip);

      if (res.alive) {
        console.log(`[${host.name}] ${res.time}ms`);
        writePing(database, host.name, res.time);
      } else {
        console.log(`[${host.name}] Communication impossible`);
        writePing(database, host.name, -1);
      }
    });
  } catch (err) {
    console.error(err);
  }
})();
