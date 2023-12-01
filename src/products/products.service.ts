import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
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
        await this.ProductRepository.save(product);
        return product;
      } catch (error) {
        // * llamo a la funcion para mostrar el error
          this.handleDBExceptions(error);
      }
  }

  async findAll() {
    try {
      const allProducts = await this.ProductRepository.find();
      return allProducts;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.ProductRepository.findOne({where: { id } });
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      if (this.findOne(id)) {
        const product = await this.ProductRepository.update(id, updateProductDto)
      }
    } catch (error) {
      this.handleDBExceptions(error)      
    }
  }

  async remove(id: string) {
    try {
      if(this.findOne(id)) {
        await this.ProductRepository.delete(id)
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
    throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
  
}
