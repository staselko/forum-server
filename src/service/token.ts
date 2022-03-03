import jwt, { GetPublicKeyOrSecret } from 'jsonwebtoken';
import Token from '../models/token';

export const generateTokens = (payload: string | object | Buffer) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || '1234', { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || '1234', { expiresIn: '30d' });

  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId: string, refreshToken: string) => {
  const tokenData = await Token.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({ user: userId, refreshToken });

  return token;
};

export const removeToken = async (refreshToken: string) => {
  const tokenData = Token.deleteOne({ refreshToken });
  return tokenData;
};

export const validateAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as unknown as GetPublicKeyOrSecret,
    );
    return userData;
  } catch (e) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const userData = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as unknown as GetPublicKeyOrSecret,
    );
    return userData;
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const findToken = async (refreshToken: string) => {
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
};
