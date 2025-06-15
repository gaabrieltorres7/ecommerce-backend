import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IOrderRepository } from '../order/order-interface';
import { OrderModule } from '../order/order.module'; // Importa o OrderModule
import { PrismaOrderRepository } from '../order/prisma/prisma-order-repository';
import { PrismaProductRepository } from '../products/prisma/prisma-product-repository';
import { IProductRepository } from '../products/product-interface';
import { ProductModule } from '../products/product.module'; // Importa o ProductModule
import { IOrderItemRepository } from './order-item-interface';
import { OrderItemController } from './order-item.controller';
import { OrderItemService } from './order-item.service';
import { PrismaOrderItemRepository } from './prisma/prisma-order-item-repository';

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [OrderItemController],
  providers: [
    OrderItemService,
    JwtService,
    {
      provide: IOrderItemRepository,
      useClass: PrismaOrderItemRepository,
    },
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
})
export class OrderItemModule {}
