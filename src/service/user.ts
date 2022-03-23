/* eslint-disable no-underscore-dangle */
import { v4 as uid } from 'uuid';
import * as bcrypt from 'bcrypt';

import User from '../models/user';
import { sendActivationMail } from './mail';
import {
  findToken, generateTokens, removeToken, saveToken, validateRefreshToken,
} from './token';
import { IUser } from '../intefaces/userInterfaces';

const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user');

export const userRegistration = async ({
  email,
  password,
  firstName,
  secondName,
  phone,
  username,
}: IUser) => {
  const candidate = await User.findOne({ email: email.toLowerCase() });
  if (candidate) {
    throw ApiError.BadRequest(`User with ${email} already exists`);
  }

  if (!password) {
    throw ApiError.BadRequest('Password is empty');
  }

  if (!email) {
    throw ApiError.BadRequest('Email is empty');
  }

  if (!firstName) {
    throw ApiError.BadRequest('Name is empty');
  }

  if (!secondName) {
    throw ApiError.BadRequest('Surname is empty');
  }

  if (!phone) {
    throw ApiError.BadRequest('Phone is empty');
  }

  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uid();
  const user = await User.create({
    email, password: hashPassword, firstName, secondName, activationLink, phone, username,
  });

  await sendActivationMail(email, `${'http://localhost:5000'}/activate/${activationLink}`);

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto, posts: null, imageUrl: null });
  await saveToken(userDto._id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

export const activateAccount = async (activationLink: string) => {
  const user = await User.findOne({ activationLink });

  if (!user) {
    throw ApiError.BadRequest('Wrong link');
  }

  user.isActivated = true;
  await user.save();
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email })
    .populate('posts');
  if (!user) {
    throw ApiError.BadRequest(`Can't find user with ${email} email`);
  }

  const isPassEquals = await bcrypt.compare(password, user.password);

  if (!isPassEquals) {
    throw ApiError.BadRequest('Wrong Password or Email');
  }

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto, posts: null, imageUrl: null });
  await saveToken(userDto._id, tokens.refreshToken);

  return {
    user: userDto,
    ...tokens,
  };
};

export const logoutUser = async (refreshToken: string) => {
  const token = await removeToken(refreshToken);
  return token;
};

export const updateToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData: any = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);

  if (!userData || !tokenFromDB) {
    throw ApiError.UnauthorizedError();
  }

  const user = await User.findById(userData._id)
    .populate('posts');
  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto, posts: null, imageUrl: null });

  await saveToken(userDto._id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};

export const checkIfUserExists = async (_id: string) => {
  const findUser = await User.findOne({ _id });
  if (findUser) {
    return findUser;
  }

  throw ApiError.BadRequest();
};
