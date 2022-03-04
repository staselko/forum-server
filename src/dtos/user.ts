module.exports = class UserDto {
  private regExp = new RegExp(/\w+/);

  email;

  id;

  isActivated;

  firstName;

  secondName;

  username;

  phone;

  constructor(model:
     {
       email: string;
       _id: string;
       isActivated: string;
       firstName: string;
       secondName: string;
       phone: string
       username: string | undefined
      }) {
    this.email = model.email;
    // eslint-disable-next-line no-underscore-dangle
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.firstName = model.firstName;
    this.secondName = model.secondName;
    this.username = model.username ? model.username : this.regExp.exec(model.email)[0];
    this.phone = model.phone;
  }
};
