export class TaskNotFoundError extends Error {
  static readonly message = 'Task not found';

  public readonly code = 'TASK.NOT_FOUND';

  constructor(cause?: Error) {
    super(TaskNotFoundError.message, cause);
  }
}

export class TaskUserInvalidError extends Error {
  static readonly message = 'Task does not belong to user';

  public readonly code = 'TASK.USER_INVALID';

  constructor(cause?: Error) {
    super(TaskUserInvalidError.message, cause);
  }
}
