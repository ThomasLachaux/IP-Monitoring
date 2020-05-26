const { errorHandler, notFound, success } = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');
const { getSummaryPings } = require('../../database');

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
