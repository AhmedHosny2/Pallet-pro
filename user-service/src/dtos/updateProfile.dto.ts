import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength} from 'class-validator';

export class UpdateProfileDTO {
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

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

     // How to check if it is mongoose.Schema.Types.ObjectId?
    @IsString()
    @IsNotEmpty()
    readonly selected_address_id: string;

    toString() {
        return JSON.stringify({
            email: this.email,
            first_name: this.first_name,
            last_name: this.last_name,
            selected_address_id: this.selected_address_id
        });

    }
}

/*
This represents the data that is sent in the request body, query, or URL parameters in the services and controllers.
*/