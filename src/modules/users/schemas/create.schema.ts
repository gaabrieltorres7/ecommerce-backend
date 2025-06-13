import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  isAdmin: z.boolean().optional(),
});

export class CreateUserSchemaDTO extends createZodDto(CreateUserSchema) {}
