import { ERROR_USER_NOT_FOUND } from './user-error.constant';

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ERROR_USER_NOT_FOUND;
  }
}
