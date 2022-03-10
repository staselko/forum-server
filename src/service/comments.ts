import User from '../models/user';
import Comment from '../models/comments';

export const addComment = async (userId: string, body: string, postId: string) => {
  try {
    const { isActivated } = await User.findOne({ _id: userId });
    if (!isActivated) {
      console.log('User profile doesnt confirmed');
    }

    const comment = Comment.create({
      postId,
      userId,
      body,
    });
    return comment;
  } catch (error) {
    console.log(error);
  }
};
