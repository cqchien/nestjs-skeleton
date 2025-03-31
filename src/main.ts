import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from 'app.module';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { setupSwagger } from 'setup-swagger';
import { ConfigServiceInterface } from 'shared/config/config.interface';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  app.enableCors();
  /**
   * Enable trust proxy to get the client's IP address
   * When the app is behind a proxy (e.g. Heroku) or a load balancer.
   * We only see the proxy's IP address so we need to config this to get the client's IP address from the `X-Forwarded-For` header.
   */
  app.enable('trust proxy');

  /**
   * Middleware Setup
   */
  // Use helmet to secure the app by setting various HTTP headers
  app.use(helmet());
  // Use morgan to log HTTP requests
  app.use(morgan('dev'));
  // Use logger middleware to log all incoming requests
  app.useLogger(app.get('Logger'));
  // Use compression to compress the response bodies
  app.use(compression());
  // Use versioning to version the API
  app.enableVersioning();

  /**
   * Global Filters and Interceptors
   */
  // Reflector is an instance of the `Reflector` class which is used to retrieve metadata from the application
  // Metadata includes the route handlers, the route parameters, the request body, and the response body
  const reflector = app.get(Reflector);
  // Use global filter to catch exceptions thrown by the application
  app.useGlobalFilters();

  // Use global interceptors to transform the response
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  /**
   * Global Pipes
   */
  // Use global pipes to transform the incoming request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app
    .select(ConfigModule)
    .get('ConfigServiceInterface') as ConfigServiceInterface;

  /**
   * Swagger Documentation
   */
  if (configService.get('NODE_ENV') !== 'production') {
    setupSwagger(app);
  }

  /**
   * Graceful Shutdown
   */
  app.enableShutdownHooks();

  /**
   * Start the app
   */
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.info(`Server is running on http://localhost:${port}`);
}

bootstrap();