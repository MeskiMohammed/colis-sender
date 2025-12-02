import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country } from '@prisma/client';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async findByCountry(country: Country) {
    return this.prisma.city.findMany({
      where: { country },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });
  }

  async create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({
      data: createCityDto,
    });
  }

  async destroy(id: number) {
    return this.prisma.city.delete({
      where: { id },
    });
  }
}
