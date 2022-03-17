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
    postId: string,
    body: string,
    _id: string,
  }
  params: {
    postId: string,
  }
}

export interface RequestPost {
  body: {
    userId?: string | number,
    id: number | string,
    title: string,
    body: string,
    comments?: [],
    [x: string]: any,
  }
  params: {
    postId: string,
  }
}
