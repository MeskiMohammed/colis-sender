import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CitiesService,PrismaService],
  controllers: [CitiesController]
})
export class CitiesModule {}
