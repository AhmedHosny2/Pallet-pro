import {IsString} from 'class-validator';

export class LoginDto {
    @IsString()
    readonly email: string;

    @IsString()
    readonly password: string;

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