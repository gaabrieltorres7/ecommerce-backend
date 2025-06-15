import { CreateOrderItemDTO } from './dto/order-item.dto';

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthGuard } from 'src/security/guards/auth.guard';
import { OrderItemService } from './order-item.service';
import { AddItemSchema } from './schemas/add-item-schema';

@UseGuards(AuthGuard)
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(AddItemSchema))
  addItem(@Request() req: ExpressRequest, @Body() body: CreateOrderItemDTO) {
    const userId = req.user.sub;
    console.log('Adding item to cart:', body);
    return this.orderItemService.addItemToCart(userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItem(@Request() req: ExpressRequest, @Param('id') orderItemId: string) {
    const userId = req.user.sub;
    return this.orderItemService.removeItemFromOrder(userId, orderItemId);
  }
}
