const success = (res, body) => res.status(200).json(body).end();

const created = (res, body) => {
  if (body) {
    return res.status(201).json(body).end();
  }

  return res.status(201).end();
};

const noContent = (res) => res.status(204).end();

const badRequest = (res, type) =>
  res
    .status(400)
    .json({ error: type || 'Bad request' })
    .end();

const notFound = (res, type) =>
  res
    .status(404)
    .json({ error: type || 'Not found' })
    .end();

const unknown = (res, type) =>
  res
    .status(500)
    .json({ error: type || 'Unknown' })
    .end();

const errorHandler = (res, err) => {
  console.error(err);
  return unknown(res);
};

module.exports = {
  success,
  created,
  noContent,
  badRequest,
  notFound,
  unknown,
  errorHandler,
};
