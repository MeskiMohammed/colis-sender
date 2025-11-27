import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Country, Status } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';
import { promises as fs } from 'fs';
import path from 'path';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private genCode() {
    let code = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  private async gerenateParcelCode() {
    let res: any;
    let code: string;
    do {
      code = this.genCode();
      res = await this.prisma.order.findFirst({
        where: { parcelCode: code },
        select: { id: true },
      });
    } while (res);
    return code;
  }

  async findAll(country: Country) {
    return await this.prisma.order.findMany({
      select: {
        id: true,
        parcelCode: true,

        recipientName: true,
        recipientPhone: true,
        recipientPhoneCode: true,
        recipientCity: { select: { id: true, name: true } },

        shipper: { select: { name: true,phone:true,phoneCode:true, city: { select: { name: true } } } },
        date: true,
        parcelNumber: true,
        productType: true,
        status: true,
        nParcels:true,
        paid:true,
      },
      where: { shipper: { country } },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        pics: true,
        shipper: { include: { city: true } },
        recipientCity: true,
      },
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    return await this.prisma.order.create({
      data: { ...createOrderDto, parcelCode: await this.gerenateParcelCode() },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  async updateStatus(id: number, status: Status){
    return await this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    const pics = await this.prisma.pic.findMany({ where: { orderId: id } });
    await Promise.all(pics.map((pic) => fs.unlink(path.join(process.cwd(), pic.url)).catch(() => null)));
    await this.prisma.pic.deleteMany({ where: { orderId: id } });
    return this.prisma.order.delete({ where: { id } });
  }
}
