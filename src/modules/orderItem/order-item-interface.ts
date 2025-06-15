import { CreatedOrderItemDTO, CreateOrderItemDTO } from './dto/order-item.dto';

export abstract class IOrderItemRepository {
  abstract create(
    data: CreateOrderItemDTO,
    unitPrice: number,
  ): Promise<CreatedOrderItemDTO>;
  abstract findById(id: string): Promise<CreatedOrderItemDTO | null>;
  abstract findByOrderId(orderId: string): Promise<CreatedOrderItemDTO[]>;
  abstract delete(id: string): Promise<boolean>;
}
