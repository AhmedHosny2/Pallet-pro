import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength} from 'class-validator';

export class RegisterDTO {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    readonly first_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    readonly last_name: string;

    refreshToken?: string;


    toString() {
        return JSON.stringify({
            email: this.email,
            password: this.password,
            first_name: this.first_name,
            last_name: this.last_name,
            refreshToken: this.refreshToken //???
        });

    }
}

/*
This represents the data that is sent in the request body, query, or URL parameters in the services and controllers.
*/