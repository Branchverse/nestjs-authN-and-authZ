import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
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
