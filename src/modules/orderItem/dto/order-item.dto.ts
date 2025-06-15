import { Prisma } from '@prisma/client';

export type CreateOrderItemDTO = {
  orderId: string;
  productId: string;
  quantity: number;
};

export type CreatedOrderItemDTO = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  product?: {
    id: string;
    name: string;
    description: string;
  };
};
