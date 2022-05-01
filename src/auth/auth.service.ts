import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async register(createUserDto: CreateUserDto) {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
        try {
            const createdUser = await this.usersService.create(createUserDto);
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            //TODO: check what a best practice response is
            if (error?.status === 409) {
                this.logger.error(`A duplicate error occured while registering a new user: (${error})`);
                throw new BadRequestException('User credentials already exist');
            }
            console.log(error)
             /* istanbul ignore next */
            this.logger.error(`An error occured while registering a new user: (${error})`);
             /* istanbul ignore next */
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

    getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
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