export interface IPost {
  userId?: string | number,
  id: number | string,
  title: String,
  body: String,
  comments?: [],
  [x: string]: any,
}

export interface RequestComment {
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
