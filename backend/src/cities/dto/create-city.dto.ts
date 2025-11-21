import { Country } from "@prisma/client"
import { Type } from "class-transformer"
import { IsString } from "class-validator"

export class CreateCityDto {
    @IsString()
    @Type(() => String)
    name: string

    @IsString()
    @Type(() => String)
    country: Country
}
