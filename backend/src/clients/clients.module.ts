import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[AuthModule],
  providers: [ClientsService,PrismaService,JwtService],
  controllers: [ClientsController]
})
export class ClientsModule {}
