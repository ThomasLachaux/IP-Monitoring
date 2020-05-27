require('./utils/env').checkEnv();
const { initDatabase } = require('./database');
const { fetchHosts, startPingInterval } = require('./utils/ping');
const { initApi } = require('./api');
const log = require('./utils/log');
const { alertByMailIfNeeded } = require('./utils/alerting');

(async () => {
  try {
    // Fetch hosts and refresh the list every 15 minutes
    let hosts = await fetchHosts();
    hosts.push({ name: 'fake', ip: '192.168.1.214' });
    setInterval(() => {
      hosts = fetchHosts();
      hosts.push({ name: 'fake', ip: '192.168.1.214' });
    }, 15 * 60 * 1000);

    const database = await initDatabase();

    setTimeout(() => {
      alertByMailIfNeeded(hosts, database);
    }, 3 * 1000);

    // setInterval(() => {
    //   alertByMailIfNeeded(hosts, database);
    // }, 5);

    startPingInterval(hosts, database);
    initApi(database, hosts);
  } catch (err) {
    log.error(err);
  }
})();
