const badRequest = (req, res, err) => {
  res.status(400).json({ errorMsg: err.message });
};

const internalServerError = (req, res, err) => {
  res.sendStatus(500);
  logError(req, err);
};

const logError = (req, err) => {
  const { baseUrl, method, params, body } = req;
  console.error(`Error responding ${req.baseUrl}`);
  console.log({ baseUrl, method, params, body });
  console.log(err);
};

module.exports = {
  badRequest,
  internalServerError,
};
