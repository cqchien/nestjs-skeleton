import {
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

import { UserConflictError } from './user-conflict.error';
import { UserNotFoundError } from './user-not-found.error';

export const USER_ERROR_MAPPING_EXCEPTION = new Map<
  new (...args: unknown[]) => Error,
  (error: { name: string; message: string }) => HttpException
>([
  [
    UserNotFoundError,
    (error) => new NotFoundException(error.name, error.message),
  ],
  [
    UserConflictError,
    (error) => new ConflictException(error.name, error.message),
  ],
]);
