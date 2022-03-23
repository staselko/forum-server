/* eslint-disable no-underscore-dangle */
import User from '../models/user';
import Comment from '../models/comments';
import Post from '../models/post';

const ApiError = require('../exceptions/api-error');

export const addComment = async (userId: string, body: string, postId: string) => {
  const {
    isActivated, firstName, secondName, imageUrl,
  } = await User.findOne({ _id: userId });
  if (!isActivated) {
    throw ApiError.BadRequest('User profile doesnt confirmed');
  }

  const post = await Post.findOne({ _id: postId });
  const comment = await Comment.create({
    postId,
    userId,
    body,
    firstName,
    secondName,
    imageUrl,
  });
  post.comments.push(comment._id);
  await post.save();
  return comment;
};
