import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length, IsEmail } from "class-validator";

export class LoginUserDto {

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: "The email for the account (is used for login)",
        default: "example.mail@gmail.com",
    })
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @Length(8)
    @ApiProperty({
        description: "The password with minimum length 8 characters",
        default: "password",
    })
    password: string;

    
}