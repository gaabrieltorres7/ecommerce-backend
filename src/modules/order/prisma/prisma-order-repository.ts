import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreatedOrderDTO } from '../dto/order.dto';
import { IOrderRepository } from '../order-interface';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<CreatedOrderDTO | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { OrderItem: true, user: true },
    });
    return order;
  }

  async findByUserId(userId: string): Promise<CreatedOrderDTO[] | null> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { OrderItem: true, user: true },
    });
    return orders;
  }

  async findAll(
    startDate?: string,
    endDate?: string,
  ): Promise<CreatedOrderDTO[]> {
    const dateFilter: Prisma.DateTimeFilter = {};

    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }

    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const whereClause: Prisma.OrderWhereInput = {};

    if (Object.keys(dateFilter).length > 0) {
      whereClause.orderDate = dateFilter;
    }

    const orders = await this.prisma.order.findMany({
      where: whereClause,
      include: { OrderItem: true, user: true },
    });

    return orders;
  }

  async updateStatus(
    id: string,
    orderStatus: 'RECEIVED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
  ): Promise<boolean> {
    await this.prisma.order.update({ where: { id }, data: { orderStatus } });
    return true;
  }

  async updateTotal(id: string, total: number): Promise<boolean> {
    await this.prisma.order.update({
      where: { id },
      data: { total: new Prisma.Decimal(total) },
    });
    return true;
  }

  async findActiveCartByUserId(
    userId: string,
  ): Promise<CreatedOrderDTO | null> {
    const order = await this.prisma.order.findFirst({
      where: {
        userId,
        orderStatus: OrderStatus.CART,
      },
      include: { OrderItem: true, user: true },
    });
    return order;
  }

  async createEmptyCart(userId: string): Promise<CreatedOrderDTO> {
    const order = await this.prisma.order.create({
      data: {
        userId,
        orderStatus: OrderStatus.CART,
        total: 0,
      },
    });
    return order;
  }
}
