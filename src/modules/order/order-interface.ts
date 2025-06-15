import { CreatedOrderDTO } from './dto/order.dto';

export abstract class IOrderRepository {
  abstract findById(id: string): Promise<CreatedOrderDTO | null>;
  abstract findByUserId(clientId: string): Promise<CreatedOrderDTO[] | null>;
  abstract findAll(
    startDate?: string,
    endDate?: string,
  ): Promise<CreatedOrderDTO[] | null>;
  abstract updateStatus(
    id: string,
    orderStatus: 'RECEIVED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED',
  ): Promise<boolean>;
  abstract findActiveCartByUserId(
    userId: string,
  ): Promise<CreatedOrderDTO | null>;
  abstract createEmptyCart(userId: string): Promise<CreatedOrderDTO>;
  abstract updateTotal(id: string, total: number): Promise<boolean>;
}
