import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {

    @IsNotEmpty()
    @IsString()
    full_name: string;
    
    @IsNotEmpty()
    @IsString()
    number_phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;
}

