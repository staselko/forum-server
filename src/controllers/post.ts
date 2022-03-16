/* eslint-disable no-param-reassign */
import { NextFunction, Response } from 'express';
import { IComment } from '../intefaces/commentInterface';
import { dtoPost } from '../dtos/comment';
import Post from '../models/post';
import User from '../models/user';
import { RequestPost } from '../intefaces/postInterfaces';
import { getPost } from '../service/post';

const UserDto = require('../dtos/user');
const ApiError = require('../exceptions/api-error');

export const readPosts = async (req: any, res: any, next: NextFunction) => {
  try {
    const posts = await Post.find()
      .populate('user comments')
      .then((data: any) => {
        data.forEach((post: any) => {
          post.user = new UserDto(post.user);
          post.comments.forEach((item: IComment, index: number) => {
            item = dtoPost(item);
            post.comments[index] = item;
          });
        });

        if (!data.length) {
          throw ApiError.BadRequest('No posts');
        }
        return data;
      });
    return res.status(200).json(posts);
  } catch (error: unknown) {
    next(error);
  }
};

export const createPost = async (req: any, res: any, next: NextFunction) => {
  const post = new Post(req.body);
  try {
    await post.save();
    const user = await User.findOne({ _id: req.body.user });

    if (!user.id) {
      throw ApiError.BadRequest('No such user');
    }

    user.posts.push(post._id);
    await user.save();
    res.status(200).json(post);
  } catch (error: unknown) {
    next(error);
  }
};

export const getTargetPost = async (req: RequestPost, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const post = await getPost(postId);
    return res.status(200).json([post]);
  } catch (error) {
    next(error);
  }
};
