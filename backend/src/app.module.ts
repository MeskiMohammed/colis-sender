import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule } from './clients/clients.module';
import { ShippersModule } from './shippers/shippers.module';
import { OrdersModule } from './orders/orders.module';
import { ParcelsModule } from './parcels/parcels.module';
import { CitiesModule } from './cities/cities.module';

@Module({
  imports: [AuthModule, ClientsModule, ShippersModule, OrdersModule, ParcelsModule, CitiesModule],
  providers: [PrismaService],
})
export class AppModule {}
