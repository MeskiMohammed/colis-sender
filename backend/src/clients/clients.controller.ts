import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Get()
    async findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.clientsService.findOne(id);
    }

    @Post()
    async create(@Body() data: CreateClientDto) {
        return this.clientsService.create(data);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateClientDto) {
        return this.clientsService.update(id, data);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.clientsService.remove(id);
    }
}
