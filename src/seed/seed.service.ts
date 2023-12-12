import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(private readonly productService: ProductsService ) { }

  async runSeed() {
    await this.deployDb();
    return 'SEED EXECUTED';
  }

  private async deployDb() {
    await this.productService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach( product => {
      // Esto funciona porque el producto luce como el craeteProductDto
      insertPromises.push( this.productService.create(product) )
    });
    // Espera a que todas las promesas se resuelvan
    await Promise.all( insertPromises );
    return true;
  }
  
}
