import type City from "./city";

export default interface Client {
  id: number;
  name: string;
  phone: string;
  phoneCode: string;
  city: City;
  cityId: number;
  address: string;
  cin: string;
  country: "Morocco" | "France";
}
