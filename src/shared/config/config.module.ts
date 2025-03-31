import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigService],
  providers: [
    {
      provide: 'ConfigServiceInterface',
      useClass: ConfigService,
    },
  ],
  exports: ['ConfigInterface'],
})
export class ConfigModule {}
