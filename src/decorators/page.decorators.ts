import { applyDecorators,Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageDto } from 'common/dto/response/page.dto';
import { PageMetaDto } from 'common/dto/response/page-meta.dto';

export function ApiPageResponse<T extends Type>(options: {
  type: T;
  description?: string;
}): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(PageDto, PageMetaDto, options.type),
    ApiOkResponse({
      description: options.description,
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(PageDto),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
              meta: { $ref: getSchemaPath(PageMetaDto) },
              extra: {
                type: 'object',
                additionalProperties: {
                  type: ['string'], // Support all types
                },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
}
