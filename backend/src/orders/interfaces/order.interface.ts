import { City, Client } from '@prisma/client';

export interface Order {
  id: number;
  parcelNumber: string;
  parcelCode: string;
  shipper: Client;
  recipientName: string;
  recipientCity: City;
  recipientPhone: string;
  recipientPhoneCode: string;
  recipientCin: string;
  homeDelivery: boolean;
  date: Date;
  productType: string;
  weight: number;
  status: 'origin' | 'inTransit' | 'inStock' | 'delivered' | 'notDelivered';
  paidAmount: number;
  nParcels: number;
  pics: string[];
  paid: boolean;
}
