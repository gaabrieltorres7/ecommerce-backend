import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IOrderRepository } from '../order/order-interface';
import { IProductRepository } from '../products/product-interface';
import { CreateOrderItemDTO } from './dto/order-item.dto';
import { IOrderItemRepository } from './order-item-interface';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly orderItemRepository: IOrderItemRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  async addItemToCart(userId: string, data: CreateOrderItemDTO) {
    const { orderId, productId, quantity } = data;

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You do not own this order.');
    }

    if (order.orderStatus !== 'CART') {
      throw new ForbiddenException(
        `Cannot add items to an order with status ${order.orderStatus}.`,
      );
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    if (product.stockQuantity < quantity) {
      throw new ForbiddenException(
        `Insufficient stock for product ${product.name}.`,
      );
    }

    const unitPrice = product.price.toNumber();
    return this.orderItemRepository.create(data, unitPrice);
  }

  async removeItemFromOrder(
    userId: string,
    orderItemId: string,
  ): Promise<void> {
    const orderItem = await this.orderItemRepository.findById(orderItemId);
    if (!orderItem) {
      throw new NotFoundException(
        `Order item with ID ${orderItemId} not found.`,
      );
    }

    const order = await this.orderRepository.findById(orderItem.orderId);

    if (!order || order.userId !== userId) {
      throw new ForbiddenException('Access to this resource is denied.');
    }

    if (order.orderStatus !== 'CART') {
      throw new ForbiddenException(
        `Cannot remove items from an order with status ${order.orderStatus}.`,
      );
    }

    await this.orderItemRepository.delete(orderItemId);
  }
}
