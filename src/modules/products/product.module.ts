import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaProductRepository } from './prisma/prisma-product-repository';
import { IProductRepository } from './product-interface';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
    JwtService,
  ],
})
export class ProductModule {}
