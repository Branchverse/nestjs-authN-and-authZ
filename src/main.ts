import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.use(cookieParser());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Dolby-Backend')
    .setDescription('Dolby-Backend for admins and artists')
    .setVersion('0.1')
    .addTag('users')
    .addTag('auth')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
