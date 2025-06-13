import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserDTO } from 'src/modules/users/dto/user.dto';
import { UserService } from 'src/modules/users/user.service';
import { CreateUserSchema } from './schemas/create.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() body: CreateUserDTO) {
    return this.userService.create(body);
  }
}
