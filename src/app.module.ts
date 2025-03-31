import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'shared/config/config.module';

import { ConfigServiceInterface } from './shared/config/config.interface';

@Module({
  imports: [
    NestConfigModule.forRoot({
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
