import { IComment } from '../intefaces/commentInterface';

export const dtoPost = (comment: IComment) => {
  const {
    _id, postId, userId, body, firstName, secondName, imageUrl,
  } = comment;
  return {
    _id, postId, userId, body, firstName, secondName, imageUrl,
  };
};
