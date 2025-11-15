import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule } from './clients/clients.module';
import { ShippersModule } from './shippers/shippers.module';

@Module({
  imports: [AuthModule, ClientsModule, ShippersModule],
  providers: [PrismaService],
})
export class AppModule {}
