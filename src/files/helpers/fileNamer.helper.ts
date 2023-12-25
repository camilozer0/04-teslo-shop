import { v4 as uuid } from 'uuid';

export const fileNamer = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // En este punto ya deberiamos tener un archivo
    if ( !file)  return callback( new Error('file is empty'), false)

    // Extraigo la extension del archivo
    const fileExtension = file.mimetype.split('/')[1];

    // Genero el nombre del archivo, un codigo UUID y la extension del archivo original
    const fileName = `${ uuid() }.${ fileExtension }`;

    callback(null, fileName);
    
}