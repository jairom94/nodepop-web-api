import express from 'express';
import { body, query } from 'express-validator';


import { productDetail,productsGet,addProduct,deleteProduct,updateProduct } from '../controllers/productController.js';


const router = express.Router();

//View Products By User
router.get('/', productsGet );

//View a product
router.get('/:productID', productDetail)

//Add product
router.post('/add', [
    body('name')
        .notEmpty()
        .withMessage('is required'),
    body('price')
        .notEmpty()
        .withMessage('is required'),
    body('image')
        .notEmpty()
        .withMessage('is required'),
    body('tags')
        .notEmpty()
        .withMessage('at least one must be chosen')
],
    addProduct);

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
