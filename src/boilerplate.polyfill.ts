import 'source-map-support/register';

import { SelectQueryBuilder } from 'typeorm';

import type { PageOptionsDto } from './common/dto/request/page-options.dto';
import { PageMetaDto } from './common/dto/response/page-meta.dto';

declare global {
  export type Uuid = string & { _uuidBrand: undefined };

  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      NODE_ENV: 'development' | 'staging' | 'production';
      GH_TOKEN: string;
      ENABLE_ORM_LOGS: boolean;

      API_VERSION: string;
      JWT_EXPIRATION_TIME: number;
      JWT_PRIVATE_KEY: string;

      DB_HOST: string;
      DB_PORT: number;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_DATABASE: string;

      REDIS_CACHE_ENABLED: boolean;
      REDIS_HOST: string;
      REDIS_PORT: number;
    }
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
