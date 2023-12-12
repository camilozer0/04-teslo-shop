import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'


@Injectable()
export class ProductsService {

  // * Para ver los logs de los errores que tenga hago esto
  private readonly logger = new Logger('ProductsService')

  // * creo el constructor e inyecto el repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    // * Para las imagenes creo otro repositorio
    @InjectRepository(ProductImage)
    private readonly productImgRepository: Repository<ProductImage>,
    // * Para el queryRunner, el dataSource al insertarse de esta manera sabe
    // *  cual es la cadena de conexion de base de datos, que usuario uso, la misma config que nuestro repositorio
    private readonly dataSource: DataSource,
  ) {}

  // * Pongo el metodo como asincrono.
  async create(createProductDto: CreateProductDto) {
      try {
        // Para sacar las imagnes ya que son una entidad distinta
        const { images = [], ...productDetails } = createProductDto;
        // * crea el producto con las propiedades, todavia no lo guarda en la base de datos
        const product = this.productRepository.create({
          ...productDetails,
          // al hacer esto creo las imagenes del producot y el TypeORM infiere que son instancias del producto
          // le asigna el id del producto a las imagenes
          images: images.map( img => this.productImgRepository.create({ url: img }))
        });
        // * Aca si lo guardo en la base de datos
        await this.productRepository.save(product);
        // Uso el operador spread para devolver las imagenes como las recibi
        return {...product, images: images};
      } catch (error) {
        // * llamo a la funcion para mostrar el error
          this.handleDBExceptions(error);
      }
  }


  async findAll(PaginationDto: PaginationDto) {
    // desestructuramos el paginationDto y pongo los valores por defecto
    const { limit = 10, offset = 0 } = PaginationDto;
      const allProducts = await this.productRepository.find({
        take: limit,
        skip: offset,
        // para ver las imagenes, me aparecen en las respuestas al llamar a findAll
        relations: {
          images: true,
        }
      });
      // Al hacer el map recorro todas las imagenes y les extraigo el url, dejo el id pr fuera
      return allProducts.map( product => ({
        ...product,
        images: product.images.map( img => img.url)
      }));
  }

  async findOne(sValue: string) {
    let product: Product;
    if ( isUUID(sValue) ) {
      product = await this.productRepository.findOneBy({ id: sValue });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      // * Aca defino un query personalizado.
      product = await queryBuilder
      .where('UPPER(title) =:title or slug =:slug', {
        title: sValue.toUpperCase(),
        slug: sValue.toLowerCase()
      })
      // Aca hago el leftJoin para que se traiga las imagenes cuando haga el queryBuilder
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
      }
      if (!product)
        throw new NotFoundException(`Product with id: ${sValue} has not been found`)
      return product;
  }

  // Creo un metodo para retornar las imagenes aplanadas
  async findOnePlain(sValue: string) {
    const { images = [], ...product} = await this.findOne(sValue);
    return {
      ...product,
      images: images.map( image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto
    const product = await this.productRepository.preload({
      id: id,
      ...toUpdate
    });
    if ( !product) throw new NotFoundException(`Product with id: ${id} has not been found`);

    // Create queryRunner
    // Definimos una serie de procedimientos, no impacta la base de datos hasta que hagamos el commit
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    
    try {
      if ( images ) {
        // tener cuidado porque se puede caer en DELETE * FROM ProductImage
        await queryRunner.manager.delete( ProductImage, { product: { id } } );
        product.images = images.map( 
          image => this.productImgRepository.create({ url: image })
          )
      }

      await queryRunner.manager.save( product );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // Al hacer el queryRunner ya no necesito esta linea
      // await this.productRepository.save( product );
      return this.findOnePlain( id );
    } catch (error) {
      // si hay un error con el queryRunner, devuelvo lo que habia hecho
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id) 
    // cuando se borre un producto que tambien se borren las imagenes
    await this.productRepository.remove( product )
  }

  private handleDBExceptions( error: any ) {
    if ( error.code === '23505' )
    throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder( 'product' );

    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
    
  }
  
}
