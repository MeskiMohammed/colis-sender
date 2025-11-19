import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Countries } from '@prisma/client';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cities.findMany();
  }

  async findByCountry(country: Countries) {
    return this.prisma.cities.findMany({
      where: { country },
    });
  }

  async create(createCityDto: CreateCityDto) {
    return this.prisma.cities.create({
      data: createCityDto,
    });
  }

  async destroy(id: number) {
    return this.prisma.cities.delete({
      where: { id },
    });
  }
}
