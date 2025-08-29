import Product from '../models/Product.js';
import * as funcTools from '../lib/funcTools.js';
import Tag from '../models/Tag.js';
import { io } from '../webSocketServer.js';
import User from '../models/User.js'


export const index = async (req, res, next) => {
    try {
        const tags = await Tag.find();
        const tagMotor = ['motor'];
        const productsMotor = await Product.find({
            tags: { $in:tagMotor.map(t => funcTools.getTagID(tags,t)) }
        }).limit(3);
        const tagLifestyle = ['lifestyle'];
        const productsLifestyle = await Product.find({
            tags: { $in:tagLifestyle.map(t => funcTools.getTagID(tags,t)) }
        }).limit(3);
        // console.log(productsMotor);
        res.locals.productsMotor = productsMotor.map(p => {
            if(!p.image.startsWith('http')){
                return {...p,image:`products/${p.image}`}
            }
            return p
        });
        res.locals.productsLifestyle = productsLifestyle.map(p => {
            if(!p.image.startsWith('http')){
                return {...p,image:`products/${p.image}`}
            }
            return p
        });
        res.render('home'); 
        
        // setTimeout(() => {
        //     console.log('Iniciando message al usuario',req.session.id);
        //     io.to('users-online').emit('server-message',`Bienvenido a ${req.session.fullname}`)           
        // }, 1000);
    } catch (error) {
        next(error)
    }
    
}


