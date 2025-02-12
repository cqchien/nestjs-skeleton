import { ERROR_USER_CONFLICT } from "./user-error.constant";

export class UserConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = ERROR_USER_CONFLICT;
  }
}
