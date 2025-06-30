import cote from 'cote';
import path from 'node:path';
import sharp from 'sharp';
import fs from 'node:fs/promises';

const responder = new cote.Responder({
    name:'thumbnail-create'
})

responder.on('create',async (event,callback)=>{
    try {
        const { imagePath } = event
        const ext = path.extname(imagePath)
        const thumbPath = imagePath.replace(ext,`_thumbnail${ext}`)

        //revisa si la ruta existe
        await fs.access(imagePath)

        await sharp(imagePath)
            .resize(100,100,{fit:'inside'})
            .toFile(thumbPath)

        callback(null,`thumbnail created: ${thumbPath}`)
    } catch (error) {
        console.error('Error al crear la miniatura:', error);
        callback(error,null)
    }
})