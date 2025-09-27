import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './common/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yaml';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('NewsFeed API')
    .setDescription('API documentation for NewsFeedApp')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlString = YAML.stringify(document);
  writeFileSync('./swagger.yaml', yamlString);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new CustomExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
void bootstrap();
