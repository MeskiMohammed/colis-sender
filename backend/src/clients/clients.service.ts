import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.clients.findMany();
    }

    async findOne(id: number) {
        return this.prisma.clients.findUnique({ where: { id } });
    }

    async create(data: CreateClientDto) {
        return this.prisma.clients.create({ data });
    }

    async update(id: number, data: UpdateClientDto) {
        return this.prisma.clients.update({ where: { id }, data });
    }

    async remove(id: number) {
        return this.prisma.clients.delete({ where: { id } });
    }
}
