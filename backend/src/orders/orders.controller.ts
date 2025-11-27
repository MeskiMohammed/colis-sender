import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Country, Status } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
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

  @Put(":id/status")
  async updateStatus(@Param("id") id:number, @Body("status") status:Status) {
    return await this.ordersService.updateStatus(id, status);
  }

  @Put(":id")
  async update(@Param("id") id:number, @Body() updateOrderDto: CreateOrderDto) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(":id")
  async remove(@Param("id") id:number){
    return await this.ordersService.remove(id);
  }
}
