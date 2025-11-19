import { Controller, Delete, Get, Post, Body, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { Countries } from '@prisma/client';
import { CreateCityDto } from './dto/create-city.dto';

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Get()
    findAll() {
        return this.citiesService.findAll();
    }

    @Get(':country')
    findByCountry(@Param('country') country: Countries) {
        return this.citiesService.findByCountry(country);
    }

    @Post()
    create(@Body() createCityDto : CreateCityDto) {
        return this.citiesService.create(createCityDto);
    }

    @Delete(':id')
    destroy(@Param('id') id: number) {
        return this.citiesService.destroy(id);
    }
}
