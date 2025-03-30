import { STATUS_CODES } from 'node:http';

import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { MetaResponseDto, ResponseDto } from 'common/dto/response/response.dto';
import type { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { mapToHttpException } from './error-mapper';

@Injectable()
export class SerializerInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response & { statusCode: number }>();

        const statusCode = response.statusCode;

        const meta = new MetaResponseDto(statusCode, STATUS_CODES[statusCode]);

        return new ResponseDto<T>(data, meta);
      }),
      catchError((error) => {
        throw mapToHttpException(error);
      }),
    );
  }
}
