const { createLogger, format, transports } = require('winston');
const moment = require('moment');

const { combine, colorize, printf } = format;

const customFormat = printf(({ level, message }) => `${moment().format('H:mm:ss')} ${level}: ${message}`);

/**
 * Creates a logger with 2 transports:
 * - A console transport to log everything
 * - A file transport to log all the errors
 */
const log = createLogger({
  transports: [
    new transports.Console({ level: 'debug' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
  format: combine(colorize(), customFormat),
});

module.exports = log;
