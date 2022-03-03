module.exports = class UserDto {
  email;

  id;

  isActivated;

  constructor(model: { email: any; _id: any; isActivated: any; }) {
    this.email = model.email;
    // eslint-disable-next-line no-underscore-dangle
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
};
