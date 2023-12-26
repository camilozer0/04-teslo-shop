import { BadGatewayException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';


@Injectable()
export class FilesService {

    getStaticProductImg( imageName: string ) {

        const path = join( __dirname, '../../static/products', imageName );
        // se verifica que exista el archivo, no devolver mucha informacion por seguridad
        if ( !existsSync(path) ) 
            throw new BadGatewayException(`No product found with image ${ imageName }`);
        return path;
    }
    
}
