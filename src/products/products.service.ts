import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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

  // TODO: paginar
  async findAll() {
      const allProducts = await this.ProductRepository.find({});
      return allProducts;
  }

  async findOne(id: string) {
      const product = await this.ProductRepository.findOneBy({ id  });
      if (!product)
        throw new NotFoundException(`Product with id: ${id} has not been found`)
      return product;
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
    const product = await this.findOne(id) 
    await this.ProductRepository.remove( product )
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
    throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
  
}
