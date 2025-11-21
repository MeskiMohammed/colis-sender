import { Country } from "@prisma/client"

export interface City {
    name: string
    country: Country
}
