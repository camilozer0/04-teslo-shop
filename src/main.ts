import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * agrego el API a la ruta
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
}
bootstrap();
