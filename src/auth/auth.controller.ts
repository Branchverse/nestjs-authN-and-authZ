import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import {JwtAuthGuard} from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    //TODO this might have to be cookie auth
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
        const { user } = request;
        const cookie = this.authService.getCookieWithJwtToken(user._id.toString());
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    //TODO this might have to be cookie auth
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.sendStatus(200);
    }
}