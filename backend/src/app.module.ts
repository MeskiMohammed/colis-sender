import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { CitiesModule } from './cities/cities.module';
import { AppController } from './app.controller';
import { FilesModule } from './files/files.module';

@Module({
  imports: [AuthModule, ClientsModule, OrdersModule, CitiesModule, FilesModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
