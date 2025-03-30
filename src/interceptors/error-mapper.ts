import { HttpException } from '@nestjs/common';
import { USER_ERROR_MAPPING_EXCEPTION } from 'errors/user/user-error-mapping.constant';

const ERROR_MAPPINGS = new Map<
  new (...args: unknown[]) => unknown,
  (error: unknown) => HttpException
>([...USER_ERROR_MAPPING_EXCEPTION]);

export function mapToHttpException(error: object): HttpException {
  const mapping = ERROR_MAPPINGS.get(error.constructor as new (...args: unknown[]) => unknown);
  if (mapping) {
    return mapping(error);
  }
  throw error;
}
