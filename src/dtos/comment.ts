import { IUser } from '../intefaces/userInterfaces';
import { IComment } from '../intefaces/commentInterface';

export const dtoPost = (comment: IComment) => {
  const {
    _id, postId, body, userId: {
      firstName, secondName, imageUrl, _id: userId,
    },
  } = comment;

  return {
    firstName, secondName, imageUrl, postId, body, _id, userId,
  };
};

export const CreatePostDto = (user: IUser) => {
  const {
    firstName, secondName, imageUrl, _id: userId,
  }: IUser = user;

  return {
    firstName, secondName, imageUrl, _id: userId,
  };
};
