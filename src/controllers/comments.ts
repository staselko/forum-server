import { addComment } from '../service/comments';
import Comment from '../models/comments';
import { RequestComment } from '../intefaces/postInterfaces';
import Post from '../models/post';
import { IComment } from '../intefaces/commentInterface';
import { dtoPost } from '../dtos/comment';

const ApiError = require('../exceptions/api-error');

export const readComments = async (req: any, res: any, next: any) => {
  try {
    const comment = await Comment.find();
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: RequestComment, res: any, next: any) => {
  try {
    const { _id: userId, body, postId } = req.body;
    const newComment = await addComment(userId, body, postId);
    return res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getTargetComments = async (req: RequestComment, res: any, next: any) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      throw ApiError.BadRequest('Such post doesnt exists');
    }
    const targetComments = await Comment.find({ postId }).populate('userId');
    res.status(200).json(targetComments);
  } catch (error) {
    next(error);
  }
};

export const redactComment = async (req: RequestComment, res: any, next: any) => {
  try {
    const { _id, body, postId } = req.body;

    const changedComment = await Comment.findOne({ _id });
    if (!_id) {
      throw ApiError.BadRequest('Such comment doesnt exists');
    }
    changedComment.body = body;
    await changedComment.save();
    const { comments } = await Post.findById({ _id: postId })
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          model: 'user',
        },
      })
      .then((data: any) => {
        if (!data._id) {
          throw ApiError.BadRequest('No such post');
        }
        data.comments.forEach((item: IComment, index: number) => {
          item = dtoPost(item);
          data.comments[index] = item;
        });
        return data;
      });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: RequestComment, res: any, next: any) => {
  try {
    const { _id, postId } = req.body;
    if (!_id) {
      throw ApiError.BadRequest('Such comment doesnt exists');
    }
    await Comment.deleteOne({ _id });
    const { comments } = await Post.findById({ _id: postId })
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          model: 'user',
        },
      })
      .then((data: any) => {
        if (!data._id) {
          throw ApiError.BadRequest('No such post');
        }
        data.comments.forEach((item: IComment, index: number) => {
          item = dtoPost(item);
          data.comments[index] = item;
        });
        return data;
      });
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
