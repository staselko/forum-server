/* eslint-disable no-unused-vars */
const ApiError = require('../exceptions/api-error');

type TError = {
  status: number,
  errors: [],
  message: string,
};

module.exports = (err: TError, req: any, res: any, next: any) => {
  if (err instanceof ApiError) {
    return res.status(err.status as number).json({ message: err.message, errors: err.errors });
  }
  return res.json({ message: 'Unexpected error' });
};
