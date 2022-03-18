module.exports = class ApiError extends Error {
  status;

  errors;

  constructor(status: any, message: any, errors: any = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Unauthorized user');
  }

  static BadRequest(message: any, errors: any) {
    return new ApiError(400, message, errors);
  }

  static PageNotFound() {
    return new ApiError(404, 'Page Not Found');
  }
};
