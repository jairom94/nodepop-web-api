import express from 'express';
import logger from 'morgan';
import path from 'node:path';
import createHttpError from 'http-errors';
// import session from 'express-session';
import connectMongoose from './lib/connectMongoose.js';
import * as sessionManager from './lib/sessionManager.js';
import * as messagesManager from './lib/messageFlash.js';
import * as buildHeader from './lib/buildHeader.js'

import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import profileRouter from './routes/profile.js';
import logoutRouter from './routes/logout.js';
import productRouter from './routes/products.js';

//import API
import * as apiLoginController from './controllers/api/apiLoginController.js'
import * as jwtAuth from './lib/jwtAuthMiddleware.js'
import * as apiProductController from './controllers/api/apiProductsController.js'
import * as apiResourcesController from './controllers/api/apiResourcesController.js'
import upload from './lib/uploadConfigure.js'
import swaggerMiddleware from './lib/swaggerMiddleware.js';

import i18n from './lib/i18nConfigure.js';
import cookieParser from 'cookie-parser';
import * as localeController from './controllers/localeController.js'
import { body } from 'express-validator';
import { validateProductPatch, validateProductPost, validateProductPut } from './validators/product-validator.js';
import Tag from './models/Tag.js';
import { deleteFileIfExist } from './lib/funcTools.js';
import { readFile } from 'node:fs/promises';



await connectMongoose();
console.log('Success connect to MongoDB');

const app = express();




app.set('views','views');
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(express.static(path.join(import.meta.dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser())
app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);

/**
 * API routes
 */
app.post('/api/login',apiLoginController.loginJWT)
app.get('/api/products'           ,jwtAuth.guard,apiProductController.list)
app.get('/api/products/:productId',jwtAuth.guard,apiProductController.getOne)
app.post('/api/products',          jwtAuth.guard,upload.single('image'),validateProductPost,apiProductController.newProduct)
app.put('/api/products/:productId',jwtAuth.guard,upload.single('image'),validateProductPut,apiProductController.update)
app.patch('/api/products/:productId',jwtAuth.guard,upload.single('image'),validateProductPatch,apiProductController.partialUpdate)
app.delete('/api/products/:productId',jwtAuth.guard,apiProductController.deleteProduct)

app.get('/api/resources/tags',apiResourcesController.TagsResource)

app.use('/api-doc',swaggerMiddleware)
/**
 * Webapplication routes
 */

app.use(i18n.init)
app.get('/change-locale/:locale', localeController.changeLocale)
app.use(buildHeader.getCategories)
// app.use(messagesManager.flashActivate);
// app.use(messagesManager.useErrorMessages);

//Rutas de la app
app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/register',registerRouter);
app.use(sessionManager.guard); 
app.use('/profile',profileRouter);
app.use('/products',productRouter); 


app.use((req,res,next)=>{   
    //Registro de error 404 
    next(createHttpError(404))
});



app.use(async (err,req,res,next)=>{
    
    if(err.array){
        if (req.url.startsWith('/products/add')) {            
            const errors = err.array().map(e =>`${e.path} ${e.msg}`)
            const title = `We can´t ${req.url.split('/')[2]} product`
            // req.flash('error',errors);
            const tags = await Tag.find()
            res.locals.tags = tags  
            res.locals.errors = errors.join(',')                   
            res.locals.oldData = req.body                        
            if (!('tags' in req.body)) {
                res.locals.oldData.tags = []
            }
            console.log(req.body);
            
            res.locals.previewImage = ''
            if(req.file){
                const buffer = await readFile(req.file.path)
                res.locals.previewImage = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;
                deleteFileIfExist(path.join('products',req.file.filename))

            }
            res.status(406).render('new-product')
            // res.redirect('/products/add')
            return
        }
        if(req.url.startsWith('/api/')){
            const errors = err.array().map(e => ({field:e.path,msg:e.msg}))
            res.json({errors})
            return
        }
    }

    //Atrapando errores de API
    if(req.url.startsWith('/api/')){
        res.status(err.status).json({error:err.message})
        return
    }

    // Atrapando error 404
    if (err.status === 404) {
        // console.log(err.message);        
        if(err.message){
            res.locals.errors = err.message
        }else{
            res.locals.errors = 'Not found, your request'
        }
        res.status(404).render('404');
        return 
    }

    //Respuesta para resto de errores    
    
    res.locals.error = err
    res.status(err.status || 500).render('error');
})


export default app;