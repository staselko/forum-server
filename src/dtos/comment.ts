import { IComment } from '../intefaces/commentInterface';

export const dtoPost = (comment: IComment) => {
  const {
    _id, postId, userId, body, firstName, secondName,
  } = comment;
  return {
    _id, postId, userId, body, firstName, secondName,
  };
};
