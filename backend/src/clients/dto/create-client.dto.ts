import { Type } from "class-transformer"
import { IsNumber, IsString } from "class-validator"

export class CreateClientDto {
    @IsString()
    @Type(()=>String)
    name: string

    @IsString()
    @Type(()=>String)
    phone: string

    @IsString()
    @Type(()=>String)
    phoneCode: string

    @IsNumber()
    @Type(()=>Number)
    cityId: number

    @IsString()
    @Type(()=>String)
    address: string
    
    @IsString()
    @Type(()=>String)
    cin: string

    @IsString()
    @Type(()=>String)
    country: 'Morocco' | 'France'
}
