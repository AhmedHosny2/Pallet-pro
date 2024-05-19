import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { MinLength, MaxLength } from 'class-validator';
export class ResetPasswordDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    resetCode: string;
}