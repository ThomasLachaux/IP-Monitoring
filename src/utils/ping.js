const pingLib = require('ping');
const log = require('./log');

/**
 * Scraps the TTL from the output of the ping command
 * @param {String} output Output of the ping command
 */
const scrapTTL = (output) => {
  const regex = /^\d+ bytes from \S+ icmp_seq=\d+ ttl=(\d+) time=\S+ ms$/gm;

  return Number(regex.exec(output)[1]);
};

const ping = async (ip) => {
  const pingResponse = await pingLib.promise.probe(ip);
  log.debug(`[Ping] ${ip} ${pingResponse.alive ? 'succeeded' : 'failed'}`);
  return {
    ip,
    alive: pingResponse.alive,
    duration: pingResponse.alive ? pingResponse.time : -1,
    ttl: pingResponse.alive ? scrapTTL(pingResponse.output) : -1,
  };
};

module.exports = ping;
