import 'source-map-support/register';

import { SelectQueryBuilder } from 'typeorm';

import type { PageOptionsDto } from './common/dto/request/page-options.dto';
import { PageMetaDto } from './common/dto/response/page-meta.dto';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };

  export interface ProcessEnv {
    PORT?: string;
    NODE_ENV: 'development' | 'staging' | 'production';
    ENABLE_ORM_LOGS?: string;

    API_VERSION?: string;
    JWT_EXPIRATION_TIME?: string;
    JWT_PRIVATE_KEY?: string;

    DB_HOST?: string;
    DB_PORT?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_DATABASE?: string;

    REDIS_CACHE_ENABLED?: string;
    REDIS_HOST?: string;
    REDIS_PORT?: string;
  }
}

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    paginate(
      this: SelectQueryBuilder<Entity>,
      pageOptionsDto: PageOptionsDto,
      options?: Partial<{ takeAll: boolean; skipCount: boolean }>,
    ): Promise<[Entity[], PageMetaDto]>;
  }
}

SelectQueryBuilder.prototype.paginate = async function (
  pageOptionsDto: PageOptionsDto,
  options?: Partial<{
    skipCount: boolean;
    takeAll: boolean;
  }>,
) {
  if (!options?.takeAll) {
    this.skip(pageOptionsDto.skip).take(pageOptionsDto.take);
  }

  const entities = await this.getMany();

  let itemCount = -1;

  if (!options?.skipCount) {
    itemCount = await this.getCount();
  }

  const pageMetaDto = new PageMetaDto({
    itemCount,
    pageOptionsDto,
  });

  return [entities, pageMetaDto];
};
