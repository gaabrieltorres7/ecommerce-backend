import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { CreatedOrderItemDTO } from '../orderItem/dto/order-item.dto';
import { IOrderItemRepository } from '../orderItem/order-item-interface';
import { IProductRepository } from '../products/product-interface';
import { IUserRepository } from '../users/user-interface';
import { CreatedOrderDTO } from './dto/order.dto';
import { IOrderRepository } from './order-interface';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userRepository: IUserRepository,
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async createEmptyCart(userId: string): Promise<CreatedOrderDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.orderRepository.createEmptyCart(userId);
  }

  async findById(id: string): Promise<CreatedOrderDTO | null> {
    const order = await this.orderRepository.findById(id);

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return order;
  }

  async findAll(
    startDate?: string,
    endDate?: string,
  ): Promise<CreatedOrderDTO[] | null> {
    const orders = await this.orderRepository.findAll(startDate, endDate);
    return orders;
  }

  async checkout(orderId: string, userId: string): Promise<boolean> {
    const order = await this.orderRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      throw new ForbiddenException('Access Denied.');
    }
    if (order.orderStatus !== 'CART') {
      throw new BadRequestException(
        'This order is not a cart and cannot be processed.',
      );
    }

    const orderItems = await this.findAndValidateOrder(orderId);
    await this.verifyStockAvailability(orderItems);
    const isPaymentApproved = this.simulatePayment();
    if (!isPaymentApproved) {
      throw new BadRequestException('Payment not approved');
    }
    await this.debitStockForOrderItems(orderItems);
    await this.orderRepository.updateStatus(orderId, 'RECEIVED');

    return true;
  }

  private async findAndValidateOrder(
    orderId: string,
  ): Promise<CreatedOrderItemDTO[]> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderItems = await this.orderItemRepository.findByOrderId(orderId);
    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException(
        'You can only confirm a payment for an order with items in it',
      );
    }

    return orderItems;
  }

  private async verifyStockAvailability(
    orderItems: CreatedOrderItemDTO[],
  ): Promise<void> {
    const productIds = orderItems.map((item) => item.productId);
    const products = await this.productRepository.findManyByIds(productIds);

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of orderItems) {
      const product = productMap.get(item.productId) as Product | undefined;

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (item.quantity > product.stockQuantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Requested: ${item.quantity}, Available: ${product.stockQuantity}`,
        );
      }
    }
  }

  private async debitStockForOrderItems(
    orderItems: CreatedOrderItemDTO[],
  ): Promise<void> {
    const itemsToDebit = orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    if (itemsToDebit.length === 0) {
      throw new BadRequestException('No items to debit stock for');
    }

    await this.productRepository.updateStockForMany(itemsToDebit);
  }

  private simulatePayment(): boolean {
    return Math.random() < 0.7;
  }
}
