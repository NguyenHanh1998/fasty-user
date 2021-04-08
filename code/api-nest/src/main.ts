require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { debugLog, logger } from './shared/logger';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Fasty')
    .setDescription('Fasty APIs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Bearer *token*',
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      'JWT',
    )
    .addSecurityRequirements('JWT')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  writeSwaggerJson(`${process.cwd()}`, document);
  SwaggerModule.setup('docs', app, document);

  app.use(logger);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 8001);
  debugLog(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

export const writeSwaggerJson = (path: string, document) => {
  fs.writeFileSync(`${path}/swagger.json`, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
};
