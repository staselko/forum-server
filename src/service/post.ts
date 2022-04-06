/* eslint-disable no-param-reassign */
import { dtoPost } from '../dtos/comment';
import { IComment } from '../intefaces/commentInterface';
import Post from '../models/post';

const UserDto = require('../dtos/user');
const ApiError = require('../exceptions/api-error');

export const getPost = async (postId: string) => {
  const targetPost = await Post.findById({ _id: postId })
    .populate({
      path: 'user comments',
      populate: {
        path: 'userId',
        model: 'user',
      },
    })
    .then((data: any) => {
      if (!data._id) {
        throw ApiError.BadRequest('No such post');
      }
      data.user = new UserDto(data.user);
      data.comments.forEach((item: IComment, index: number) => {
        item = dtoPost(item);
        data.comments[index] = item;
      });
      return data;
    })
    .catch(() => { throw ApiError.PageNotFound(); });
  return targetPost;
};

export const changePost = async (_id: string, newBody: string) => {
  const post = await Post.findById({ _id })
    .populate('user comments')
    .then((data: any) => {
      if (!data._id) {
        throw ApiError.BadRequest('No such post');
      }
      data.title = newBody;

      data.user = new UserDto(data.user);
      data.comments.forEach((item: IComment, index: number) => {
        item = dtoPost(item);
        data.comments[index] = item;
      });

      return data;
    });
  await post.save();
  return post;
};
