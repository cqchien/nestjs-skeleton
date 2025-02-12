import { HttpException } from '@nestjs/common';
import { USER_ERROR_MAPPING_EXCEPTION } from 'errors/user/user-error-mapping.constant';

const ERROR_MAPPINGS = new Map<Function, (error: any) => HttpException>([
  ...USER_ERROR_MAPPING_EXCEPTION,
]);

export function mapToHttpException(error: any): HttpException {
  const mapping = ERROR_MAPPINGS.get(error.constructor);
  if (mapping) {
    return mapping(error);
  }
  throw error;
}
