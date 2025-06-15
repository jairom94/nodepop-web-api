import Product from '../models/Product.js';
import * as funcTools from '../lib/funcTools.js';
import Tag from '../models/Tag.js';


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
        res.locals.productsMotor = productsMotor;
        res.locals.productsLifestyle = productsLifestyle;
        res.render('home');    
    } catch (error) {
        next(error)
    }
    
}


