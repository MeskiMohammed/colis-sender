import { City, Client } from "@prisma/client";

export interface Order {
parcelNumber: string;
parcelCode: string;
shipper: Client;
recipientName:string
recipientCity:City
recipientNum:string
recipientCin:string
HomeDelivery: boolean;
date:Date
productType: string;
weight: number;
statut : "origin" | "inTransit" | "inStock" | "delivered" | "notDelivered"
payedAmount: number;
NParcels:number;
pics:string[];
payed: boolean;
}
