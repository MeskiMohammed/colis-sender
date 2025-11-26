import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Country } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("country/:country")
  async findAll(@Param("country") country:Country){
    return await this.ordersService.findAll(country);
  }

  @Get(":id")
  async findOne(@Param("id") id:number){
    return await this.ordersService.findOne(id);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @Delete(":id")
  async remove(@Param("id") id:number){
    return await this.ordersService.remove(id);
  }
}
