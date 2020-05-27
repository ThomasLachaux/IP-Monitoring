require('./utils/env').checkEnv();
const { initDatabase } = require('./database');
const { fetchHosts, startPingInterval } = require('./utils/ping');
const { initApi } = require('./api');
const log = require('./utils/log');
const { startAlertCheckInterval } = require('./utils/alerting');

(async () => {
  try {
    // Fetch hosts and refresh the list every FETCH_HOST_INTERVAL minutes
    log.info(`Fetches hosts every ${process.env.FETCH_HOST_INTERVAL} minutes`);
    let hosts = await fetchHosts();
    hosts.push({ name: 'fake', ip: '192.168.1.214' });
    setInterval(() => {
      hosts = fetchHosts();
      hosts.push({ name: 'fake', ip: '192.168.1.214' });
    }, process.env.FETCH_HOST_INTERVAL * 60 * 1000);

    const database = await initDatabase();

    startPingInterval(hosts, database);
    startAlertCheckInterval(hosts, database);

    initApi(database, hosts);
  } catch (err) {
    log.error(err);
  }
})();
