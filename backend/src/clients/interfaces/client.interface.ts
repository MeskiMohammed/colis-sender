import { City } from "../../cities/interfaces/city.interface"

export interface Client {
    name: string
    phone: string
    phoneCode: string
    city: City
    address: string
    cin: string
    country: 'Morocco' | 'France'
}
