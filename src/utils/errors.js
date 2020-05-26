/**
 * Custom error used when a ressource could not be found
 */
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = { NotFoundError };
