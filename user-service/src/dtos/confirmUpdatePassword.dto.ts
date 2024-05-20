import {IsString, IsNotEmpty} from 'class-validator';

export class ConfirmUpdatePasswordDTO {
    @IsString()
    @IsNotEmpty()
    readonly code: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    toString() {
        return JSON.stringify({
            password: this.password,
            code: this.code,
        });

    }
}