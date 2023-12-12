import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // Importo el productsModule para usar lo que hay en el
  imports: [
    ProductsModule
  ]
})
export class SeedModule {}
