import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AdminGuard } from 'src/security/guards/admin.guard';
import { CreateProductDTO, UpdateProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';
import { CreateProductSchema } from './schemas/create.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AdminGuard)
  @Post('')
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  create(@Body() body: CreateProductDTO) {
    return this.productService.create(body);
  }

  @Get('')
  list(@Query('q') query?: string) {
    return this.productService.findAll(query || '');
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Put(':id')
  update(@Param('id') productId: string, @Body() body: UpdateProductDTO) {
    return this.productService.update(productId, body);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
