export interface IComment {
  _id: string,
  postId: string,
  userId: string,
  imageUrl?: string,
  body: string,
  firstName: string,
  secondName: string,
  createdAt?: string,
  updatedAt?: string,
  __v?: number
}
