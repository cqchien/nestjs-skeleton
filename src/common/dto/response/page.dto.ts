import { PageMetaDto } from './page-meta.dto';

export class PageDto<T> {
  readonly data: T[];
  readonly meta: PageMetaDto;
  readonly extra?: Record<string, string | boolean | number>;

  constructor(
    data: T[],
    meta: PageMetaDto,
    extra?: Record<string, string | boolean | number>,
  ) {
    this.data = data;
    this.meta = meta;
    this.extra = extra;
  }
}
