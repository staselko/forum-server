import { NextFunction, Response } from 'express';
import { IComment } from '../intefaces/commentInterface';
import { dtoPost } from '../dtos/comment';
import Post from '../models/post';
import User from '../models/user';
import { RequestPost } from '../intefaces/postInterfaces';
import { getPost, changePost } from '../service/post';

const UserDto = require('../dtos/user');
const ApiError = require('../exceptions/api-error');

export const readPosts = async (req: any, res: any, next: NextFunction) => {
  try {
    const { limit, startIndex } = res;
    const posts = await Post.find().limit(limit).skip(startIndex)
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

export const createPost = async (req: RequestPost, res: any, next: NextFunction) => {
  try {
    const post = new Post(req.body);

    await post.save();

    const user = await User.findOne({ _id: req.body.user });

    if (!user.id) {
      throw ApiError.BadRequest('No such user');
    }

    user.posts.push(post._id);
    await user.save();
    return res.status(200).json(post);
  } catch (error: unknown) {
    next(error);
  }
};

export const getTargetPost = async (req: RequestPost, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    if (!(postId.length === 24)) {
      throw ApiError.PageNotFound();
    }
    const post = await getPost(postId);

    if (!post) {
      throw ApiError.PageNotFound();
    }
    return res.status(200).json([post]);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: RequestPost, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const deletingPost = await Post.findByIdAndDelete({ _id: postId });
    const user = await User.findById({ _id: deletingPost.user })
      .populate('posts');

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const editPost = async (req: RequestPost, res: Response, next: NextFunction) => {
  try {
    const { _id, title } = req.body;
    const post = await changePost(_id, title);
    const user = await User.findById({ _id: post.user._id })
      .populate('posts');
    return res.status(200).json(user.posts);
  } catch (error) {
    next(error);
  }
};
