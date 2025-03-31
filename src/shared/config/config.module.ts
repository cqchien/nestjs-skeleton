import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'ConfigServiceInterface',
      useClass: ConfigService,
    },
  ],
  exports: ['ConfigServiceInterface'],
})
export class ConfigModule {}
