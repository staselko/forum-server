/* eslint-disable import/no-import-module-exports */
import { validateAccessToken } from '../service/token';

module.exports = function (req: any) {
  try {
    console.log(req);
    const authHeader = req.body.authorization;
    if (!authHeader) {
      console.log('Unauthorized error');
    }

    const accessToken = authHeader.split(' ')[1];

    const userData = validateAccessToken(accessToken);

    req.user = userData;

    if (!userData) {
      console.log('Unauthorized error');
    }
  } catch (error) {
    console.log('Unauthorized error', error);
  }
};
