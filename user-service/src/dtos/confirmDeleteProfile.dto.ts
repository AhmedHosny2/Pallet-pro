import {IsString, IsNotEmpty, IsNumber} from 'class-validator';

export class ConfirmDeleteProfileDTO {
    @IsNumber()
    @IsNotEmpty()
    readonly code: number;

    toString() {
        return JSON.stringify({
            code: this.code,
        });

    }
}