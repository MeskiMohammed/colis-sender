import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
  @IsString()
  @Type(()=>String)
  parcelNumber: string;

  @IsNumber()
  @Type(()=>Number)
  shipperId: number;

  @IsString()
  @Type(()=>String)
  recipientName: string;
  
  @IsString()
  @Type(()=>String)
  recipientCin: string;

  @IsBoolean()
  @Type(()=>Boolean)
  homeDelivery: boolean;
  
  @IsNumber()
  @Type(()=>Number)
  recipientCityId: number;
  
  @IsString()
  @Type(()=>String)
  recipientPhone: string;
  
  @IsString()
  @Type(()=>String)
  recipientPhoneCode: string;

  @IsBoolean()
  @Type(()=>Boolean)
  paid: boolean;
  
  @IsNumber()
  @Type(()=>Number)
  paidAmount: number;
  
  @IsNumber()
  @Type(()=>Number)
  nParcels: number;
  
  @IsString()
  @Type(()=>String)
  productType: string;
  
  @IsNumber()
  @Type(()=>Number)
  weight: number;
}
