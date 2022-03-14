/* eslint-disable no-unused-vars */
import cookieParser from 'cookie-parser';
import { cookie, validationResult } from 'express-validator';
import { contextsKey } from 'express-validator/src/base';
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comments';
import {
  userRegistration, activateAccount, loginUser, logoutUser, updateToken,
} from '../service/user';

const ApiError = require('../exceptions/api-error');

type ReqBody = {
  body: {
    email: string,
    password: string,
    firstName: string,
    secondName: string,
    phone: string,
    username: string,
  },
  params?: {
    userId?: string,
    usersPaginationNum?: string,
  }
}

export const readUsers = async (req: any, res: any) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const readTargetUser = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ id: userId }).populate('post').exec((err: any, u: any) => {
      if (err) return console.log(err);
      console.log('The author is %s', u);
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const editUser = async (req: ReqBody, res: any) => {
  try {
    const { userId: _id } = req.params;
    const user = await User.findOneAndUpdate({ _id }, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const registration = async (req: ReqBody, res: any, next: any) => {
  try {
    const {
      email,
      password,
      firstName,
      secondName,
      username,
      phone,
    } = req.body;

    const userData = await userRegistration({
      email,
      password,
      firstName,
      secondName,
      username,
      phone,
    });

    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const activate = async (req: any, res: any, next: any) => {
  try {
    const activationLink = req.params.link;
    await activateAccount(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    const userData = await loginUser(email, password);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json(userData);
  } catch (error: any) {
    next(error, 5, 5);
  }
};

export const logout = async (req: any, res: any, next: any) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const refresh = async (req: any, res: any, next: any) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await updateToken(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: ReqBody, res: any, next: any) => {
  try {
    const { userId: _id } = req.params;
    await User.deleteOne({ _id });
    await Post.find({ userId: _id }).remove();
    await Comment.find({ userId: _id }).remove();
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const readUsersTargetPage = async (req: any, res: any, next: any) => {
  try {
    const step = 10;
    const { usersPaginationNum } = req.params;
    const userToShow = await User.find({ createdOn: { $lte: req.createdOnBefore } })
      .limit(step * usersPaginationNum)
      .sort('-createdOn');
    return res.status(200).json(userToShow);
  } catch (error) {
    next(error);
  }
};
