import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import LocalAuthGuard from './guards/localAuth.guard';
import Public from './guards/public.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Throttle(2, 60)
    @Get()
    @ApiResponse({ status: HttpStatus.OK, description: 'User authenticated', type: User })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Cookie is not valid' })
    @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Please wait a while don\'t spam' })
    authenticate(@Req() request: RequestWithUser) {
        return plainToInstance(User, request.user);
    }

    @Public()
    @Throttle(3, 60)
    @Post('register')
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User created', type: User })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User credentials already exist' })
    @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Please wait a while don\'t spam' })
    async register(@Body() createUserDto: CreateUserDto) {
        return plainToInstance(User, await this.authService.register(createUserDto));
    }

    @Public()
    @Throttle(3, 60)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(200)
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in', type: User })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Credentials' })
    @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Please wait a while don\'t spam' })
    async logIn(@Req() request: RequestWithUser, @Res() response: Response, @Body() loginUserDto: LoginUserDto) {
        const user = plainToInstance(User, request.user)
        const cookie = this.authService.getCookieWithJwtToken(user._id.toString());
        response.setHeader('Set-Cookie', cookie);
        //TODO currently sends pw too!!!
        return response.send(user);
    }

    @Public()
    @Throttle(2, 60)
    @Post('logout')
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged out' })
    @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Please wait a while don\'t spam' })
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.sendStatus(200);
    }
}