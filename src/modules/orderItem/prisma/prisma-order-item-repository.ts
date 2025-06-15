import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateOrderItemDTO, CreatedOrderItemDTO } from '../dto/order-item.dto';
import { IOrderItemRepository } from '../order-item-interface';

@Injectable()
export class PrismaOrderItemRepository implements IOrderItemRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateOrderItemDTO,
    unitPrice: number,
  ): Promise<CreatedOrderItemDTO> {
    const { orderId, productId, quantity } = data;
    const unitPriceDecimal = new Prisma.Decimal(unitPrice);
    const subtotal = unitPriceDecimal.mul(quantity);

    const [createdItem] = await this.prisma.$transaction([
      this.prisma.orderItem.create({
        data: {
          orderId,
          productId,
          quantity,
          unitPrice: unitPriceDecimal,
          subtotal,
        },
      }),
      this.prisma.order.update({
        where: { id: orderId },
        data: {
          total: {
            increment: subtotal,
          },
        },
      }),
    ]);
    return createdItem;
  }

  async findById(id: string): Promise<CreatedOrderItemDTO | null> {
    return this.prisma.orderItem.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async findByOrderId(orderId: string): Promise<CreatedOrderItemDTO[]> {
    return this.prisma.orderItem.findMany({
      where: { orderId },
      include: { product: true },
    });
  }

  async delete(id: string): Promise<boolean> {
    const itemToDelete = await this.findById(id);
    if (!itemToDelete) {
      throw new NotFoundException(`Order Item with ID ${id} not found.`);
    }

    await this.prisma.$transaction([
      this.prisma.orderItem.delete({ where: { id } }),
      this.prisma.order.update({
        where: { id: itemToDelete.orderId },
        data: {
          total: {
            decrement: itemToDelete.subtotal,
          },
        },
      }),
    ]);

    return true;
  }
}
