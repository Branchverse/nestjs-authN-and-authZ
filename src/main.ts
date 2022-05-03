import { Logger, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './auth/guards/jwtAuth.guard';

async function bootstrap() {
  const logger = new Logger('Swagger')
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.use(cookieParser());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth Backend')
    .setDescription('User management backend')
    .setVersion('0.1')
    .addTag('users')
    .addTag('auth')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  
  await app.listen(process.env.PORT || 3001);
  logger.log("http://localhost:" + (process.env.PORT || 3001) + "/swagger")
}
bootstrap();
