const ApiError = require('../exceptions/api-error');

module.exports = (err: any, req: any, res: any) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.erros });
  }
  return res.status(err.status).json({ message: 'Unexpected error' });
};
