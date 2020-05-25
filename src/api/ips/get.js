const {
  badRequest,
  unknown,
  errorHandler,
  notFound,
} = require('../../utils/responses');
const { NotFoundError } = require('../../utils/errors');
const { getPings } = require('../../database');

const get = async (req, res) => {
  try {
    const { ip } = req.params;

    const pings = await getPings(req.app.locals.database, ip);

    return res.status(200).json(pings).end();
  } catch (err) {
    if (err instanceof NotFoundError) {
      return notFound(res, 'The IP has no records');
    }

    return errorHandler(res, err);
  }
};

module.exports = get;
