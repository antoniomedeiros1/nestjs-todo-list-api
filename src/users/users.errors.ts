export class UserAlreadyExistsError extends Error {
  static readonly message = 'User already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error) {
    super(UserAlreadyExistsError.message, cause);
  }
}

export class UserNotFoundError extends Error {
  static readonly message = 'User not found';

  public readonly code = 'USER.NOT_FOUND';

  constructor(cause?: Error) {
    super(UserNotFoundError.message, cause);
  }
}

export class UserPasswordIncorrectError extends Error {
  static readonly message = 'User password is incorrect';

  public readonly code = 'USER.PASSWORD_INCORRECT';

  constructor(cause?: Error) {
    super(UserPasswordIncorrectError.message, cause);
  }
}
