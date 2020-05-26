require('./utils/env').checkEnv();
const { initDatabase } = require('./database');
const { fetchHosts, startPingInterval } = require('./utils/ping');
const { initApi } = require('./api');
const log = require('./utils/log');

(async () => {
  try {
    const hosts = await fetchHosts();
    const database = await initDatabase();

    startPingInterval(hosts, database);
    initApi(database, hosts);
  } catch (err) {
    log.error(err);
  }
})();
