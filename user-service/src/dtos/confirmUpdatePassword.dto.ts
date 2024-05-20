import {IsString, IsNotEmpty, MinLength, MaxLength} from 'class-validator';

export class ConfirmUpdatePasswordDTO {
    @IsString()
    @IsNotEmpty()
    readonly code: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;

    toString() {
        return JSON.stringify({
            password: this.password,
            code: this.code,
        });

    }
}