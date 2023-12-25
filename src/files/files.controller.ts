import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  // Uso un interceptor para procesar el archivo.
  @UseInterceptors( FileInterceptor('file', {
    // envio la referencia al fileFilter que tengo en la carpeta helper
    fileFilter: fileFilter
  }) )
  // Uso el decorador para saber que es un archivo, asi como Body o QueryParams
  uploadFile( @UploadedFile(
    // * Puedo usar el parseFilePipe para hacer las validaciones (revisar)
    // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({ maxSize: 10000 }),
    //     new FileTypeValidator({ fileType: 'image/jpeg' }),
    //   ],
    // }),
  ) file: Express.Multer.File ) {

    if ( !file ) {
      throw new BadRequestException('Make sure the file is an image');
    }
    // Lo que se debe hacer es no guardar en el fileSystem, sino en otro lugar
    // No quiero que las imagenes esten en el mismo lugar donde esta el codigo de mi aplicacion
    return {
      fileName: file.originalname
    };
  }

}
