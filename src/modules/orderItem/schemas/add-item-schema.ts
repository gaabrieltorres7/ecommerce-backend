import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AddItemSchema = z.object({
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export class AddItemSchemaDTO extends createZodDto(AddItemSchema) {}
