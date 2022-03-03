module.exports = class ApiError extends Error {
  status;

  errors;

  constructor(status: any, message: string | undefined, errors: any = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(404, 'Unauthorized user');
  }

  static BadRequest() {
    return new ApiError(400, 'Bad Request');
  }
};
