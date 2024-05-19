import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength} from 'class-validator';

export class AddressDTO {
    // name: { type: String, required: true },
    // country: { type: String, required: true },
    // city: { type: String, required: true },
    // address_line_1: { type: String, required: true },
    // address_line_2: { type: String },
    // zip_code: { type: String, required: true },
    // created_at: { type: Date, default: Date.now },
    // updated_at: { type: Date, default: Date.now },
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    @IsString()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    address_line_1: string;

    @IsString()
    address_line_2: string;

    @IsString()
    @IsNotEmpty()
    zip_code: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    created_at: Date;

    @IsString()
    updated_at: Date;

    toString() {
        return JSON.stringify({
            name : this.name,
            country : this.country,
            city : this.city,
            address_line_1 : this.address_line_1,
            address_line_2 : this.address_line_2,
            zip_code : this.zip_code,
            user_id : this.user_id,
            created_at : this.created_at,
            updated_at : this.updated_at
        });

    }
}

/*
This represents the data that is sent in the request body, query, or URL parameters in the services and controllers.
*/