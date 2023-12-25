
export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function ) => {

    // Evalua el archivo y si no esta lo rechazo (false)
    if ( !file)  return callback( new Error('file is empty'), false)

    // el mimetype nos dice el tipo que tenemos
    // Esta parte es para dejar o no pasar el archivo
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    // verifico que el archivo sea una imagen
    if ( validExtensions.includes( fileExtension )) {
        return callback(null, true);
    }
    // de lo contrario no acepto el archivo
    callback(null, false);
    
}