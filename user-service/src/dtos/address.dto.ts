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
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    zip_code: string;

    toString() {
        return JSON.stringify({
            id : this.id,
            name : this.name,
            country : this.country,
            city : this.city,
            address_line_1 : this.address_line_1,
            address_line_2 : this.address_line_2,
            zip_code : this.zip_code,
        });

    }
}

/*
This represents the data that is sent in the request body, query, or URL parameters in the services and controllers.
*/