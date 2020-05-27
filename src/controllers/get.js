const { errorHandler, notFound, success } = require('../utils/responses');
const { NotFoundError } = require('../utils/errors');
const { getSummaryPings } = require('../models/pings');

/**
 * Give count, average duration and average ttl given an IP
 * @async
 * @param {Request} req express request
 * @param {Response} res express response
 */
const get = async (req, res) => {
  try {
    const { ip } = req.params;

    const pings = await getSummaryPings(req.app.locals.database, ip);

    return success(res, pings);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return notFound(res, err.message);
    }

    return errorHandler(res, err);
  }
};

module.exports = get;
