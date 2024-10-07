export type ExceptionObject = {
  code: number;
  message: string;
  type: string;
  errors?: any;
};

export default class HttpException extends Error {
  protected code: number;
  protected type: string;

  constructor(message: string, code: number = 400) {
    super(message);
    this.code = code;
    this.type = "ERROR";
  }

  getCode() {
    return this.code;
  }

  getMessage() {
    return this.message;
  }

  toObject(): ExceptionObject {
    return {
      code: this.code,
      message: this.message.toString(),
      type: this.type,
    };
  }
}

export class AuthenticationException extends HttpException {
  constructor(message: string = "authentication failed") {
    super(message, 401);
    this.type = "AUTHENTICATION_ERROR";
  }
}

export class AuthorizationException extends HttpException {
  constructor(message: string = "permission denied to this resource") {
    super(message, 403);
    this.type = "AUTHORIZATION_ERROR";
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = "a problem occurred with the request") {
    super(message);
    this.type = "BAD_REQUEST_ERROR";
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string = "requested resource not found") {
    super(message, 404);
    this.type = "NOT_FOUND_ERROR";
  }
}

export class ValidationException extends HttpException {
  protected errors: any;

  constructor(message: string = "something went wrong", errors?: any) {
    super(message, 422);
    this.type = "VALIDATION_ERROR";
    this.errors = errors || undefined;
  }

  toObject(): ExceptionObject {
    return {
      code: this.code,
      message: this.message.toString(),
      type: this.type,
      errors: this.errors,
    };
  }
}

export class ServerException extends HttpException {
  constructor(message: string = "something went wrong on the server") {
    super(message, 500);
    this.type = "SERVER_ERROR";
  }
}
