import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from 'app.module';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<INestApplication>(
    AppModule,
    new ExpressAdapter(),
  );
}
