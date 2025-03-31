import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigServiceInterface } from './shared/config/config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigServiceInterface) =>
        configService.databaseConfig,
      inject: ['ConfigServiceInterface'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
