import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findOneProduct(
    // Uso este decorador para tomar el control de la respuesta que quiero obtener en el endpoint
    // Hay que tener cuidado porque se puede saltar interceptores y otras cosas
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImg( imageName );
    // Envio el archivo que esta en este path, si la imagen no existe no la envia
    res.sendFile( path )
  }

  // ! Para los archivos lo mejor es guardarlos en otra parte, aca lo vamos a hacer en el filesystem
  // ! lo cual es una practica que se DEBE evitar a toda costa, por motivos de seguridad
  @Post('product')
  // Uso un interceptor para procesar el archivo.
  @UseInterceptors( FileInterceptor('file', {
    // envio la referencia al fileFilter que tengo en la carpeta helper
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }) )
  // Uso el decorador para saber que es un archivo, asi como Body o QueryParams
  uploadFile( @UploadedFile(
    // * Puedo usar el parseFilePipe para hacer las validaciones (revisar)
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }),
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ],
    }),
  ) file: Express.Multer.File ) {

    if ( !file ) {
      throw new BadRequestException('Make sure the file is an image');
    }
    const secureUrl = `${ file.filename }`
    // Lo que se debe hacer es no guardar en el fileSystem, sino en otro lugar
    // No quiero que las imagenes esten en el mismo lugar donde esta el codigo de mi aplicacion
    return {
      secureUrl
    };
  }


  
}
