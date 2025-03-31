import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import { SnakeNamingStrategy } from 'snake-naming.strategy';

@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get databaseConfig(): TypeOrmModuleOptions {
    const entities = [
      path.join(__dirname, `../../../modules/**/*.entity{.ts,.js}`),
    ];
    const migrations = [
      path.join(__dirname, `../../../database/migrations/*{.ts,.js}`),
    ];

    return {
      entities,
      migrations,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(`${key} environment variable is not a number`);
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(value);
    } catch {
      throw new Error(`${key} env var is not a boolean`);
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value ? value.replaceAll(String.raw`\n`, '\n') : '';
  }

  get(key: string): string | undefined {
    return this.configService.get<string>(key);
  }
}
