import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Country } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(country: Country) {
    return this.prisma.client.findMany({
      select: {
				id: true,
        name: true,
        cin: true,
        phoneCode: true,
        phone: true,
        address: true,
        cityId:true,
        city: { select: { name: true } },
      },
      where: { country },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { city: true },
    });
  }

  async create(data: CreateClientDto) {
    return this.prisma.client.create({ data });
  }

  async update(id: number, data: UpdateClientDto) {
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }
}
