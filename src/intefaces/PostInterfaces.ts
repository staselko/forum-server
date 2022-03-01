export interface IPost {
  userId?: string | number,
  id: number | string,
  title: String,
  body: String,
  comments?: [],
  [x: string]: any,
}
