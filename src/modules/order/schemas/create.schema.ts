import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const CreateOrderSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, 'An order must have at least one item'),
});

export class CreateOrderSchemaDTO extends createZodDto(CreateOrderSchema) {}
