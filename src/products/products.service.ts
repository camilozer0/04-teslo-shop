import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'


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


  async findAll(PaginationDto: PaginationDto) {

    // desestructuramos el paginationDto y pongo los valores por defecto
    const { limit = 10, offset = 0 } = PaginationDto;
      const allProducts = await this.ProductRepository.find({
        take: limit,
        skip: offset,
        // TODO: relaciones
      });
      return allProducts;
  }

  async findOne(sValue: string) {

    let product: Product;
    if ( isUUID(sValue) ) {
      product = await this.ProductRepository.findOneBy({ id: sValue });
    } else {
      const queryBuilder = this.ProductRepository.createQueryBuilder();
      // * Aca defino un query personalizado.
      product = await queryBuilder
      .where('UPPER(title) =:title or slug =:slug', {
        title: sValue.toUpperCase(),
        slug: sValue.toLowerCase()
      }).getOne();
      }
      if (!product)
        throw new NotFoundException(`Product with id: ${sValue} has not been found`)
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
