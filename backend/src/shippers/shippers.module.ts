import { Module } from '@nestjs/common';
import { ShippersService } from './shippers.service';
import { ShippersController } from './shippers.controller';

@Module({
  providers: [ShippersService],
  controllers: [ShippersController]
})
export class ShippersModule {}
