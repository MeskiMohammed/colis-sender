import { Countries } from "@prisma/client"

export interface City {
    name: string
    country: Countries
}
