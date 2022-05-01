import { ApiParam, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Roles } from "../../shared/enums/roles";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "The desired displayed username",
        default: "exampleUser",
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        description: "The password with minimum length 8 characters",
        default: "password",
    })
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: "The email for the account (is used for login)",
        default: "example.mail@gmail.com",
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "The first name of the user",
        default: "firstName",
    })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "The last name of the user",
        default: "lastName",
    })
    lastName: string;

    @IsOptional()
    @IsEnum(Roles)
    @ApiProperty({
        description: "The role of the created user",
        default: Roles.UNASSIGNED
    })
    role: Roles;
}
