import { NextFunction } from 'express';
import User from '../models/user';
import Post from '../models/post';
import Comment from '../models/comments';
import {
  userRegistration, activateAccount, loginUser, logoutUser, updateToken,
} from '../service/user';

const ApiError = require('../exceptions/api-error');
const UserDto = require('../dtos/user');

type ReqBody = {
  body: {
    email: string,
    password: string,
    firstName: string,
    secondName: string,
    phone: string,
    username: string,
    imageUrl: string,
  },
  params?: {
    userId?: string,
    usersPaginationNum?: string,
  }
}

export const readUsers = async (req: any, res: any) => {
  try {
    const { search } = req.query;
    const { limit, quantity } = res;
    if (!search) {
      const user = await User.find()
        .limit(limit)
        .populate('posts')
        .then((data: any) => data);

      res.status(200).json(user);
    } else if (search.length) {
      const users = await User.find({ username: { $regex: `${search}`, $options: 'i' } })
        .limit(quantity)
        .then((data: any) => (data));
      res.status(200).json(users);
    } else {
      res.status(200);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const readTargetUser = async (req: any, res: any, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ _id: userId })
      .populate('posts')
      .catch(() => { throw ApiError.PageNotFound(); });
    if (!user) {
      throw ApiError.PageNotFound();
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: ReqBody, res: any) => {
  try {
    const { userId: _id } = req.params;
    await User.findOneAndUpdate({ _id }, req.body);
    await Post.find({ user: _id })
      .populate('user');

    const updatedUser = await User.findOne({ _id })
      .populate('posts');

    await Comment.find({ userId: _id })
      .populate('userId')
      .then((comment: any) => {
        comment.forEach(async (item: any, index: any) => {
          comment[index].firstName = updatedUser.firstName;
          comment[index].secondName = updatedUser.secondName;
          if (req.body.imageUrl) {
            comment[index].imageUrl = updatedUser.imageUrl;
          }
          try {
            await comment[index].save();
          } catch (error: any) {
            throw ApiError.BadRequest('Error while updating profile');
          }
        });
        return comment;
      });

    const userDto = new UserDto(updatedUser);

    res.status(200).json(userDto);
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
    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: any, res: any, next: any) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await logoutUser(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  } catch (error) {
    next(error);
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
    await Post.find({ user: _id }).remove();
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
