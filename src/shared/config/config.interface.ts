import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface ConfigServiceInterface {
  databaseConfig: TypeOrmModuleOptions;
  get(key: string): string | undefined;
}
