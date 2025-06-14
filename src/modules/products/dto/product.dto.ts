import { Prisma } from '@prisma/client';

export type CreateProductDTO = {
  name: string;
  description: string;
  price: Prisma.Decimal;
  stockQuantity: number;
};

export type CreatedProductDTO = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  OrderItem?: any[];
} & CreateProductDTO;

export type UpdateProductDTO = {
  id: string;
  name?: string;
  description?: string;
  price?: Prisma.Decimal;
  stockQuantity?: number;
};
