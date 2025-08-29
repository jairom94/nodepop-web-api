import multer from "multer";
import path from 'node:path';


const storage = multer.diskStorage({
    destination:function(req,file,cb) {
        const ruta = path.join(import.meta.dirname,'..','public','products')
        cb(null,ruta)
    },
    filename:function(req,file,cb){
        const filename = `${Date.now()}-${file.originalname}`
        cb(null,filename)        
    }
})

/**
 * 
 * @param {import("express").Request} req 
 * @param {Express.Multer.File} file 
 * @param {(error:Error | null , acceptFile:boolean)=>void} cb 
 */
const fileFilter = (req,file,cb) => {
    // if(!file){
    //     cb(new Error('image is required, validate from multer'),false);
    // }
    if(file.mimetype.startsWith('image/')){
        cb(null,true);
    }else{
        cb(new Error('only image files are allowed'),false);
    }
}

const upload = multer({ 
    storage,
    fileFilter
 })

export default upload