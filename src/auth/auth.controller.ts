import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiCookieAuth, ApiHeader, ApiHeaders, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { OptionalJwtAuthGuard } from './guards/optionalJwtAuth.guard';
import { Public } from './guards/public.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiResponse({ status: HttpStatus.OK, description: 'User authenticated' , type: User})
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Cookie is not valid' })
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        return plainToInstance(User, request.user);
    }

    @Public()
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User created', type: User })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User credentials already exist' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return plainToInstance(User, await this.authService.register(createUserDto));
    }

    @Public()
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in', type: User})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Credentials' })
    @Post('login')
    async logIn(@Req() request: RequestWithUser, @Res() response: Response, @Body() loginUserDto: LoginUserDto) {
        const { user } = request;
        const cookie = this.authService.getCookieWithJwtToken(user._id.toString());
        response.setHeader('Set-Cookie', cookie);
        //TODO currently sends pw too!!!
        return response.send(plainToInstance(User, user));
    }

    @ApiResponse({ status: HttpStatus.OK, description: 'User logged out' })
    @Post('logout')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
        return response.sendStatus(200);
    }
}