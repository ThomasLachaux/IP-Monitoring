const moment = require('moment');
const { errorHandler, notFound, success } = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');
const { getPings } = require('../../database');

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

/**
 * List hour, day, and week availibility for a given ip
 * @param {Request} req express request
 * @param {Response} res express response
 */
const availibility = async (req, res) => {
  try {
    const { ip } = req.params;

    const pings = await getPings(req.app.locals.database, ip);

    // Format {hourAvailibility,dayAvailibility, weekAvailibility}
    const formattedResponse = {
      host: pings[0].host,
      ip: pings[0].ip,
      hourAvailibility: getAvailibility(pings, 1),
      dayAvailibility: getAvailibility(pings, 24),
      weekAvailibility: getAvailibility(pings, 24 * 7),
    };

    return success(res, formattedResponse);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return notFound(res, err.message);
    }

    return errorHandler(res, err);
  }
};

module.exports = availibility;
