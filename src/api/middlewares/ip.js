const { badRequest } = require('../../utils/responses');

const checkIpv4 = (req, res, next) => {
  const { ip } = req.params;

  const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/;

  if (regex.test(ip)) {
    return next();
  }
  return badRequest(res, 'Invalid ip');
};

module.exports = { checkIpv4 };
