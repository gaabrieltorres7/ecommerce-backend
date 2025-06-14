import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  price: z.number().min(0, 'Price must be a positive number'),
  stockQuantity: z.number(),
});

export class CreateProductSchemaDTO extends createZodDto(CreateProductSchema) {}
