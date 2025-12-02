import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Country, StatusEnum } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Get('country/:country')
  async findAll(@Param('country') country: Country) {
    return await this.ordersService.findAll(country);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.ordersService.findOne(id);
  }

  @Get('code/:parcelCode')
  async getByCode(@Param('parcelCode') parcelCode: string) {
    try {
      return await this.ordersService.findOneByCode(parcelCode);
    } catch (e) {
      throw new NotFoundException('Order not found');
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: StatusEnum) {
    return await this.ordersService.updateStatus(id, status);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.ordersService.remove(id);
  }
}
