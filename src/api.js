const http = require('http');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swagger = require('swagger-ui-express');
const yaml = require('yamljs');
const ips = require('./controllers');
const { notFound } = require('./utils/responses');
const log = require('./utils/log');

/**
 * Initilize API
 * @async
 * @param {Object} host host object {name, ip}
 * @param {InfluxDB} database influxdb database
 */
const initApi = async (database, hosts) => {
  // API initialization
  const app = express();
  const server = http.createServer(app);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.locals.database = database;

  // Middleware initialization
  app.use(helmet());
  app.use(morgan('dev'));

  // API Documentation serve
  const swaggerDocument = await yaml.load('openapi.yml');
  app.use('/docs/api', swagger.serve, swagger.setup(swaggerDocument));

  // Jsdoc serve
  app.use('/docs/jsdoc', express.static('docs'));

  // Routes setup
  app.use('/ips', ips());
  app.get('/', (req, res) => res.status(200).render('home', { hosts }));

  app.use((req, res) => notFound(res));

  // Listening setup
  server.listen(process.env.API_PORT, () => {
    log.info(`Listening on port ${process.env.API_PORT}`);
  });
};

module.exports = { initApi };
