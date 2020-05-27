const moment = require('moment');

/**
 * Computes the availibility from a set of pings
 * @param {Array} pings initial data
 * @param {Number} range filters by last X hours
 * @returns {Number} availibility in percents
 */
const getAvailibility = (pings, range) => {
  const startTime = moment().subtract(range, 'hour');

  return (
    pings
      .filter((ping) => moment(ping.time).isAfter(startTime))
      .reduce((acc, curr) => {
        const isAvailable = curr.duration === -1 ? 0 : 100;

        return acc + isAvailable;
      }, 0) / pings.length
  );
};

module.exports = { getAvailibility };
