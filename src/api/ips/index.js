const { Router } = require('express');
const get = require('./get');
const { checkIpv4 } = require('../middlewares/ip');

const routes = () => {
  const router = Router();

  router.get('/:ip', checkIpv4, get);

  return router;
};

module.exports = routes;
