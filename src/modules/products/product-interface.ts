import {
  CreateProductDTO,
  CreatedProductDTO,
  UpdateProductDTO,
} from './dto/product.dto';

export abstract class IProductRepository {
  abstract create(data: CreateProductDTO): Promise<CreatedProductDTO>;
  abstract findById(id: string): Promise<CreatedProductDTO | null>;
  abstract findByName(name: string): Promise<CreatedProductDTO | null>;
  abstract findAll(query: string): Promise<CreatedProductDTO[] | null>;
  abstract update(id: string, data: UpdateProductDTO): Promise<boolean>;
  abstract delete(id: string): Promise<boolean>;
  abstract updateStockForMany(
    items: { productId: string; quantity: number }[],
  ): Promise<boolean>;
  abstract findManyByIds(ids: string[]): Promise<CreatedProductDTO[]>;
}
