import { BadRequestException, HttpException, InternalServerErrorException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "./dto/register-user.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";

export class AuthService {
    constructor(
        private readonly usersService: UsersService
    ) { }

    public async register(createUserDto: CreateUserDto) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        try {
            const createdUser = await this.usersService.create(createUserDto);
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === '11000') {
                throw new BadRequestException('User with that email already exists');
            }
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        } catch (error) {
            throw new BadRequestException('Wrong credentials provided');
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new BadRequestException('Wrong credentials provided');
        }
    }
}