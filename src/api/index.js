const http = require('http');
const express = require('express');
const helmet = require('helmet');
const ips = require('./ips');
const { notFound } = require('../utils/responses');

const initApi = (database) => {
  const app = express();
  const server = http.createServer(app);

  app.locals.database = database;

  app.use(helmet());

  app.use('/ips', ips());

  app.use((req, res) => notFound(res));

  server.listen(process.env.API_PORT, () => {
    console.log(`Listening on port ${process.env.API_PORT}`);
  });
};

module.exports = { initApi };
