import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService){}

  async findAll(){
    return await this.prisma.order.findMany({include:{pics:true}})
  }
}
