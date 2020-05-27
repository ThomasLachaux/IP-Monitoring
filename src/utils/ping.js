const axios = require('axios');
const pingLib = require('ping');
const log = require('./log');
const { writePing } = require('../models/pings');

/**
 * Scraps the TTL from the output of the ping command
 * @param {String} output Output of the ping command
 */
const scrapTTL = (output) => {
  const regex = /^\d+ bytes from \S+ icmp_seq=\d+ ttl=(\d+) time=\S+ ms$/gm;

  return Number(regex.exec(output)[1]);
};

/**
 * Sends a ICMP request to a specific IP
 * @async
 * @param {String} ip host ip
 */
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

/**
 * Fetch the hosts from the pool url
 * The format of the pool must be {ips: [{name: string, ip: string}]}
 * @async
 */
const fetchHosts = async () => {
  const response = await axios.get(process.env.HOST_POOL_URL);
  const hosts = response.data.ips;
  log.debug(`Fetch hosts from ${process.env.HOST_POOL_URL}. Found ${hosts.length} hosts`);

  return hosts;
};

/**
 * Create an interval to ping all hosts
 * @param {Array} hosts pool list
 * @param {InfluxDB} database influxdb database
 * @async
 */
const startPingInterval = async (hosts, database) => {
  const interval = () => {
    hosts.forEach(async (host) => {
      const res = await ping(host.ip);
      writePing(database, host.name, host.ip, res.duration, res.ttl);
    });
  };

  interval();
  return setInterval(interval, Number(process.env.PING_INTERVAL) * 1000);
};

module.exports = { fetchHosts, startPingInterval };
