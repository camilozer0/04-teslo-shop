import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * agrego el API a la ruta
  app.setGlobalPrefix('api');

  // * despues de instalar validator, los acivo aca
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  
  await app.listen(3000);
}
bootstrap();
