const { Router } = require('express');
const get = require('./get');
const availibility = require('./availibility');
const { checkIpv4 } = require('../middlewares/ip');

const routes = () => {
  const router = Router();

  router.get('/:ip', checkIpv4, get);
  router.get('/:ip/availibility', checkIpv4, availibility);

  return router;
};

module.exports = routes;
