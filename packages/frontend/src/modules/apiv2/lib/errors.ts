import { NOT_FOUND, SERVER_ERROR, UNAUTHORIZED, UNKNOWN_ERROR } from '../constants';

type ErrorResponse = {
  message: string;
}

export class ApiError extends Error {
  error: undefined | string;

  constructor(error?: ErrorResponse) {
    super();

    if (error) {
      this.error = error.message;
    }
  }

  toString(): string {
    return this.error || UNKNOWN_ERROR;
  }
}

export class BadRequest extends ApiError {}
export class InternalServerError extends ApiError {
  toString(): string {
    return SERVER_ERROR;
  }
}
export class NotFound extends ApiError {
  toString(): string {
    return NOT_FOUND;
  }
}
export class Unauthorized extends ApiError {
  toString(): string {
    return UNAUTHORIZED;
  }
}
