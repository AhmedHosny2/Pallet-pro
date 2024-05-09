import {IsString, IsEmail, IsNotEmpty} from 'class-validator';

export class LoginDto {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    password: string;

    toString() {
        return JSON.stringify({
            email: this.email,
            password: this.password
        });
    }
}

/*
This represents the data that is sent in the request body, query, or URL parameters in the services and controllers.
*/