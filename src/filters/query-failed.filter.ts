import { STATUS_CODES } from 'node:http';

import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MetaResponseDto, ResponseDto } from 'common/dto/response/response.dto';
import type { Response } from 'express';
import { findKey } from 'lodash';
import { QueryFailedError } from 'typeorm';

import { CONSTRAINT_ERRORS } from './constraint-errors';

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter<QueryFailedError> {
  private readonly _logger = new Logger(QueryFailedFilter.name);

  constructor(public reflector: Reflector) {}

  catch(
    exception: QueryFailedError & { constraint?: string },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.constraint?.startsWith('UQ')
      ? HttpStatus.CONFLICT
      : HttpStatus.INTERNAL_SERVER_ERROR;

    this._logger.error(status);

    const metaResponseDto = new MetaResponseDto(
      status,
      STATUS_CODES[status],
      exception.constraint ??
        findKey(
          CONSTRAINT_ERRORS,
          (value) => value === HttpStatus.INTERNAL_SERVER_ERROR.toString(),
        ),
    );

    response.status(status).json(new ResponseDto(null, metaResponseDto));
  }
}
