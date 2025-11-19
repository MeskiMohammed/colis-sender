import { Client } from "../../clients/interfaces/client.interface";
import { Parcel } from "../../parcels/interfaces/parcel.interface";
import { Shipper } from "../../shippers/interfaces/shipper.interface";


export interface Order {
orderNumber: string;
orderCode: string;
date:Date
weight: number;
statut : "origin" | "inTransit" | "inStock" | "delivered" | "notDelivered"
amount: number;
type: string;
payed: boolean;
HomeDelivery: boolean;
shipper: Shipper;
client: Client;
parcel:Parcel

// -------------> Option livraison à domicile
// En origine | En route | En stock | Livré | Non livré
// CIN expéditeur / destinataire
// Nombre de colis
// Photos du colis
// Type de produit
}
