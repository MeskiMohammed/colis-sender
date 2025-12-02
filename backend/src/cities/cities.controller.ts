import { Controller, Delete, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { Country } from '@prisma/client';
import { CreateCityDto } from './dto/create-city.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Get(':country')
    findByCountry(@Param('country') country: Country) {
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
