import { v4 as uid } from 'uuid';
import * as bcrypt from 'bcrypt';

import User from '../models/user';
import { sendActivationMail } from './mail';
import {
  findToken, generateTokens, removeToken, saveToken, validateRefreshToken,
} from './token';
import { IUser } from '../intefaces/UserInterfaces';

const UserDto = require('../dtos/user');

export const userRegistration = async ({
  email,
  password,
  firstName,
  secondName,
  phone,
  username,
}: IUser) => {
  const candidate = await User.findOne({ email });
  if (candidate) {
    throw new Error(`User ${email} already exists`);
  }
  const hashPassword = await bcrypt.hash(password, 3);
  const activationLink = uid();
  const user = await User.create({
    email, password: hashPassword, firstName, secondName, activationLink, phone, username,
  });
  await sendActivationMail(email, `${'http://localhost:5000'}/activate/${activationLink}`);

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

export const activateAccount = async (activationLink: string) => {
  const user = await User.findOne({ activationLink });

  if (!user) {
    throw new Error('Wrong link');
  }

  user.isActivated = true;
  await user.save();
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    console.log('user is undefined');
  }

  const isPassEquals = await bcrypt.compare(password, user.password);

  if (!isPassEquals) {
    console.log('password is wrong');
  }

  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });
  await saveToken(userDto.id, tokens.refreshToken);

  return {
    ...tokens,
    user: userDto,
  };
};

export const logoutUser = async (refreshToken: string) => {
  const token = await removeToken(refreshToken);
  return token;
};

export const updateToken = async (refreshToken: string) => {
  if (!refreshToken) {
    console.log('wrong token');
  }

  const userData: any = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);

  if (!userData || !tokenFromDB) {
    console.log('unauthorized user');
  }

  const user = await User.findById(userData.id);
  const userDto = new UserDto(user);
  const tokens = generateTokens({ ...userDto });

  await saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
};
