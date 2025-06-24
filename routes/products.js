import express from 'express';
import { body, query } from 'express-validator';
import upload from '../lib/uploadConfigure.js'


import { productDetail,productsGet,addProduct,deleteProduct,updateProduct } from '../controllers/productController.js';
import Tag from '../models/Tag.js';


const router = express.Router();

//View Products By User
router.get('/', productsGet );

//View to add new product
router.get('/add',async (req,res,next)=>{
    try {
        const tags = await Tag.find()
        res.locals.tags = tags
        res.render('new-product')
    } catch (error) {
        next(error)
    }
})

//Add product
router.post(
    '/add', 
    upload.single('image'),
    [
    body('name')
        .notEmpty()
        .withMessage('is required'),
    body('price')
        .notEmpty()
        .withMessage('is required'),
    body('tags')
        .notEmpty()
        .withMessage('at least one must be chosen')
],
    addProduct);

//View a product
router.get('/:productID', productDetail)

//Delete product
router.get('/delete/:id', [
    query('allow')
        .notEmpty()
        .withMessage('not must be empty')
        .custom((value) => value === 'true')
        .withMessage('we can´t delete this product'),
],
    deleteProduct);

//Update product
router.post('/update/:id',updateProduct)

export default router;
