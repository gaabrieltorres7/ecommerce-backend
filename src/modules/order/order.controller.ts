import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AdminGuard } from 'src/security/guards/admin.guard';
import { AuthGuard } from 'src/security/guards/auth.guard';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  createCart(@Request() req: ExpressRequest) {
    const userId = req.user.sub;
    return this.orderService.createEmptyCart(userId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/confirm-payment')
  confirmPayment(@Request() req: ExpressRequest, @Param('id') orderId: string) {
    const userId = req.user.sub;
    return this.orderService.checkout(orderId, userId);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.orderService.findAll(startDate, endDate);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }
}
