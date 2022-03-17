import { IPost } from '../intefaces/postInterfaces';

module.exports = class UserDto {
  static regExp = new RegExp(/\w+/);

  email;

  _id;

  isActivated;

  firstName;

  secondName;

  username;

  phone;

  posts;

  constructor(model:
     {
       email: string,
       _id: string,
       isActivated: string,
       firstName: string,
       secondName: string,
       phone: string,
       username: string | undefined,
       posts: IPost[],
      }) {
    this.email = model.email;
    // eslint-disable-next-line no-underscore-dangle
    this._id = model._id;
    this.isActivated = model.isActivated;
    this.firstName = model.firstName;
    this.secondName = model.secondName;
    this.username = model.username ? model.username : UserDto.regExp.exec(model.email)[0];
    this.phone = model.phone;
    this.posts = model.posts;
  }
};
