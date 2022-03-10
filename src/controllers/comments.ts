/* eslint-disable import/prefer-default-export */
import { addComment } from '../service/comments';
import Comment from '../models/comments';

type RequestComment = {
  body: {
    id: string,
    postId: string,
    body: string,
    _id: string,
  }
  params: {
    postId: string,
  }
}

export const readComments = async (req: any, res: any) => {
  try {
    const comment = await Comment.find();
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
  }
};

export const createComment = async (req: RequestComment, res: any) => {
  try {
    const { id: userId, body, postId } = req.body;
    const userCreator = await addComment(userId, body, postId);
    return res.status(200).json(userCreator);
  } catch (error) {
    console.log(error);
  }
};

export const getTargetComments = async (req: RequestComment, res: any) => {
  try {
    const { postId } = req.params;
    const targetComments = await Comment.find({ postId });
    res.status(200).json(targetComments);
  } catch (error) {
    console.log(error);
  }
};

export const redactComment = async (req: RequestComment, res: any) => {
  try {
    const { body, _id } = req.body;

    const changedComment = await Comment.findOneAndUpdate({ _id }, { body });
    res.status(200).json(changedComment);
  } catch (error) {
    console.log(error);
  }
};
