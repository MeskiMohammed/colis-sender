import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({url,orderId}: {url:string,orderId:number}){
    await this.prismaService.pic.create({data:{url,orderId}})
  }
}
