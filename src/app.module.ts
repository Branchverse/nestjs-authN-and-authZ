import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>('DB_URI'),
          // user: configService.get<string>('DB_USER'),
          // pass: configService.get<string>('DB_PASS')
      }),
      inject: [ConfigService]
  }),
    AuthModule,
    UsersModule
  ]
})
export class AppModule { }
