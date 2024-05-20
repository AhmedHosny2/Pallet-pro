import { Options, Post } from '@nestjs/common';
import {IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, IsPhoneNumber, isPostalCode, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from 'class-validator';

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

    @IsString()
    @IsNotEmpty()
    address_name: string;

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
    @IsPhoneNumber()
    phone_number: string;

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