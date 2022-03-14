import User from '../models/user';
import Comment from '../models/comments';

const ApiError = require('../exceptions/api-error');

export const addComment = async (userId: string, body: string, postId: string) => {
  const { isActivated } = await User.findOne({ _id: userId });
  if (!isActivated) {
    throw ApiError.BadRequest('User profile doesnt confirmed');
  }

  const comment = Comment.create({
    postId,
    userId,
    body,
  });
  return comment;
};
