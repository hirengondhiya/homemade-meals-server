const badRequest = (req, res, err) => {
  res.sendStatus(400);
  logInfo(req, err);
};

const internalServerError = (req, res, err) => {
  res.sendStatus(500);
  logInfo(req, err);
};

const logInfo = (req, err) => {
  const { baseUrl, method, params, body } = req;
  console.error(`Error responding ${req.baseUrl}`);
  console.log({ baseUrl, method, params, body });
  console.log(err);
};

module.exports = {
  badRequest,
  internalServerError,
};
