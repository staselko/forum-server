export interface IUser {
  firstName: string,
  secondName: string,
  email: string,
  password: string | Buffer,
  phone: string,
  username: string,
  imageUrl?: string,
  _id?: string,
}
