import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  // * Para ver los logs de los errores que tenga hago esto
  private readonly logger = new Logger('ProductsService')

  // * creo el constructor e inyecto el repositorio
  constructor(
    @InjectRepository(Product)
    private readonly ProductRepository: Repository<Product>,
  ) {}

  // * Pongo el metodo como asincrono.
  async create(createProductDto: CreateProductDto) {
      try {
        // * crea el producto con las propiedades, todavia no lo guarda en la base de datos
        const product = this.ProductRepository.create(createProductDto);
        // * Aca si lo guardo en la base de datos
        await this.ProductRepository.save( product );
        return product;
      } catch (error) {
        this.logger.error(error);
        throw new InternalServerErrorException('Ayuda');
      }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
