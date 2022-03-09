/* eslint-disable no-unused-vars */
import cookieParser from 'cookie-parser';
import { cookie, validationResult } from 'express-validator';
import { contextsKey } from 'express-validator/src/base';
import User from '../models/user';
import {
  userRegistration, activateAccount, loginUser, logoutUser, updateToken,
} from '../service/user';

type ReqBody = {
  body: {
    email: string,
    password: string,
    firstName: string,
    secondName: string,
    phone: string,
    username: string,
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

export const createUser = async (req: any, res: any) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const readTargetUser = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ id: userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const editUser = async (req: any, res: any) => {
  const { userId } = req.params;
  try {
    const user = await User.findOneAndUpdate({ id: userId }, req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const registration = async (req: ReqBody, res: any, next: any) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
    }

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
    res.status(400).json({ error });
  }
};

export const activate = async (req: any, res: any, next: any) => {
  try {
    const activationLink = req.params.link;
    await activateAccount(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;

    const userData = await loginUser(email, password);
    res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    return res.json(userData);
  } catch (error) {
    res.status(400).json({ error });
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
    console.log('refresh error');
  }
};
