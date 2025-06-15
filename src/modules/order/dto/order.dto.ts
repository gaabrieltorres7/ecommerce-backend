import { Prisma } from '@prisma/client';
import { CreatedUserDTO } from 'src/modules/users/dto/user.dto';
import { CreatedOrderItemDTO } from '../../orderItem/dto/order-item.dto';

export type CreatedOrderDTO = {
  id: string;
  userId: string;
  orderStatus: 'RECEIVED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CART';
  orderDate: Date;
  total: Prisma.Decimal;
  OrderItem?: CreatedOrderItemDTO[];
  user?: CreatedUserDTO;
};
