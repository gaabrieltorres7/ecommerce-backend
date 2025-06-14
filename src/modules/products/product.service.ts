import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatedProductDTO,
  CreateProductDTO,
  UpdateProductDTO,
} from './dto/product.dto';
import { IProductRepository } from './product-interface';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: IProductRepository) {}

  async create({
    name,
    description,
    price,
    stockQuantity,
  }: CreateProductDTO): Promise<CreatedProductDTO> {
    const findProductByName = await this.productRepository.findByName(name);

    if (findProductByName)
      throw new BadRequestException('Product already exists');

    const product = await this.productRepository.create({
      name,
      description,
      price,
      stockQuantity,
    });

    return product;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.productRepository.delete(id);
      return true;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findById(id: string): Promise<CreatedProductDTO | null> {
    const product = await this.productRepository.findById(id);

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async findAll(query: string): Promise<CreatedProductDTO[] | null> {
    return await this.productRepository.findAll(query || '');
  }

  async update(id: string, data: UpdateProductDTO): Promise<boolean> {
    try {
      await this.productRepository.update(id, data);
      return true;
    } catch (error) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
