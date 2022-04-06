import { IUser } from './userInterfaces';

export interface IComment {
  _id: string,
  postId: string,
  userId?: string | IUser | any,
  imageUrl?: string,
  body: string,
  firstName?: string,
  secondName?: string,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}
