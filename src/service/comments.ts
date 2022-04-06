/* eslint-disable no-underscore-dangle */
import User from '../models/user';
import Comment from '../models/comments';
import Post from '../models/post';
import { dtoPost } from '../dtos/comment';

const ApiError = require('../exceptions/api-error');

export const addComment = async (userId: string, body: string, postId: string) => {
  const {
    isActivated,
  } = await User.findOne({ _id: userId });
  if (!isActivated) {
    throw ApiError.BadRequest('User profile doesnt confirmed');
  }

  const post = await Post.findOne({ _id: postId });
  const createdComment = await Comment.create({
    postId,
    userId,
    body,
  });
  const comment = await Comment.findById({ _id: createdComment._id })
    .populate('userId')
    .then((data: any) => {
      data = dtoPost(data);
      return data;
    });
  post.comments.push(comment._id);
  await post.save();
  return comment;
};
