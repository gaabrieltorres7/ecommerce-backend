import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IOrderItemRepository } from '../orderItem/order-item-interface';
import { PrismaOrderItemRepository } from '../orderItem/prisma/prisma-order-item-repository';
import { PrismaProductRepository } from '../products/prisma/prisma-product-repository';
import { IProductRepository } from '../products/product-interface';
import { ProductModule } from '../products/product.module';
import { PrismaUserRepository } from '../users/prisma/prisma-user-repository';
import { IUserRepository } from '../users/user-interface';
import { IOrderRepository } from './order-interface';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaOrderRepository } from './prisma/prisma-order-repository';

@Module({
  imports: [ProductModule, OrderModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    JwtService,
    {
      provide: IOrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: IOrderItemRepository,
      useClass: PrismaOrderItemRepository,
    },
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
})
export class OrderModule {}
