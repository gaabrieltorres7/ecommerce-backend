import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import {
  CreateProductDTO,
  CreatedProductDTO,
  UpdateProductDTO,
} from '../dto/product.dto';
import { IProductRepository } from '../product-interface';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductDTO): Promise<CreatedProductDTO> {
    const product = await this.prisma.product.create({ data });
    return product;
  }

  async findById(id: string): Promise<CreatedProductDTO | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { OrderItem: true },
    });
    return product;
  }

  async findByName(name: string): Promise<CreatedProductDTO | null> {
    const product = await this.prisma.product.findFirst({
      where: { name },
      include: { OrderItem: true },
    });
    return product;
  }

  async findAll(query: string): Promise<CreatedProductDTO[] | null> {
    if (!query) return await this.prisma.product.findMany({});

    const lowerCaseQuery = query.toLowerCase();
    const parsedQuery = parseFloat(lowerCaseQuery);

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: lowerCaseQuery,
            },
          },
          {
            description: {
              contains: lowerCaseQuery,
            },
          },
          {
            price: {
              equals: isNaN(parsedQuery) ? undefined : parsedQuery,
            },
          },
          {
            stockQuantity: {
              equals: isNaN(parsedQuery) ? undefined : parseInt(lowerCaseQuery),
            },
          },
        ],
      },
      include: { OrderItem: true },
    });
    return products;
  }

  async update(id: string, data: UpdateProductDTO): Promise<boolean> {
    await this.prisma.product.update({
      where: { id },
      data,
    });

    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.product.delete({ where: { id } });
    return true;
  }

  async updateStockForMany(
    items: { productId: string; quantity: number }[],
  ): Promise<boolean> {
    if (items.length === 0) return false;
    try {
      await this.prisma.$transaction(
        items.map((item) =>
          this.prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      );
      return true;
    } catch (error) {
      console.error('Error updating stock for multiple products:', error);
      return false;
    }
  }

  async findManyByIds(ids: string[]): Promise<CreatedProductDTO[]> {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return products;
  }
}
