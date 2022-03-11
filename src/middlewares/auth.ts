/* eslint-disable import/no-import-module-exports */
import { validateAccessToken } from '../service/token';

const ApiError = require('../exceptions/api-error');

module.exports = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.body.authorization;
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;

    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};
