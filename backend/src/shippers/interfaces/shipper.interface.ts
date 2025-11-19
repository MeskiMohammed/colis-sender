import { City } from "../../cities/interfaces/city.interface"

export interface Shipper {
    name: string
    countryCode: string
    phone: string
    city:City
}
