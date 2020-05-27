const nodemailer = require('nodemailer');
const { getAvailibility } = require('./availibility');
const { getPings } = require('../models/pings');
const { isHostMarkedAvailable, writeHost } = require('../models/hosts');
const log = require('./log');

/**
 * Checks if one host has been down more that 5 minutes.
 * @async
 * @param {Object} host host object {name, ip}
 * @param {InfluxDB} database influxdb database
 */
const isHostDown = async (host, database) => {
  const pings = await getPings(database, host.ip);

  // Get the availability in 5 minutes
  const availibility = getAvailibility(pings, 5 / 60);

  return availibility === 0;
};

/**
 * Creates a mail transporter and sends a mail
 * @async
 * @param {String} subject subject of the mail
 * @param {String} text content of the mail
 */
const sendMail = (subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: process.env.MAIL_SENDER,
    to: process.env.MAIL_RECEIVER,
    subject,
    text,
  });
};

/**
 * Sends an alert report if there is an host down
 * @async
 * @param {Array} hosts pool list
 * @param {InfluxDB} database influxdb database
 */
const alertByMailIfNeeded = async (hosts, database) => {
  const newDownHosts = [];

  await Promise.all(
    hosts.map(async (host) => {
      // Does the host is marked as available ?
      const wasAvailable = await isHostMarkedAvailable(database, host.name, host.ip);
      const isDown = await isHostDown(host, database);

      // If the host was available and now is down
      if (wasAvailable && isDown) {
        writeHost(database, host.name, host.ip, false);
        log.error(`[${host.name}] ${host.ip} has be down for more than 5 minutes`);
        newDownHosts.push(host);
      }

      // If the host wasn't available and now is up
      else if (!wasAvailable && !isDown) {
        writeHost(database, host.name, host.ip, true);
        log.info(`RESOLVED : [${host.name}] ${host.ip} has be down for more than 5 minutes`);
      }
    }),
  );

  // If there are new down hosts, send a mail
  if (newDownHosts.length > 0) {
    log.info('Send alert mail');

    // Transforms the array of hosts to a string like "host (ip)""
    const summary = newDownHosts.map((host) => `${host.name} (${host.ip})`).join(', ');

    try {
      await sendMail('Alert ! Hosts Down !', `The following hosts have been down for more than 5 minutes: ${summary}`);
    } catch (err) {
      log.error('Failed to send the mail');
      log.error(err);
    }
  }
};

module.exports = { alertByMailIfNeeded };
