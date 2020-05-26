const http = require('http');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swagger = require('swagger-ui-express');
const yaml = require('yamljs');
const ips = require('./ips');
const { notFound } = require('../utils/responses');
const log = require('../utils/log');

const initApi = async (database, hosts) => {
  const app = express();
  const server = http.createServer(app);

  app.locals.database = database;

  // Middleware initialization
  app.use(helmet());
  app.use(morgan('dev'));
  const swaggerDocument = await yaml.load('openapi.yml');
  app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.use('/ips', ips());
  app.get('/', (req, res) => res.status(200).render('home', { hosts }));

  app.use((req, res) => notFound(res));

  server.listen(process.env.API_PORT, () => {
    log.info(`Listening on port ${process.env.API_PORT}`);
  });
};

module.exports = { initApi };
