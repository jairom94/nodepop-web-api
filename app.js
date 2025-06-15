import express from 'express';
import logger from 'morgan';
import path from 'node:path';
import createHttpError from 'http-errors';
// import session from 'express-session';
import connectMongoose from './lib/connectMongoose.js';
import * as sessionManager from './lib/sessionManager.js';
import * as messagesManager from './lib/messageFlash.js';

import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import profileRouter from './routes/profile.js';
import logoutRouter from './routes/logout.js';
import productRouter from './routes/products.js';


await connectMongoose();
console.log('Success connect to MongoDB');

const app = express();




app.set('views','views');
app.set('view engine','ejs');

app.use(logger('dev'));
app.use(express.static(path.join(import.meta.dirname,'public')))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(sessionManager.middleware);
app.use(sessionManager.useSessionInViews);
app.use(messagesManager.flashActivate);
app.use(messagesManager.useErrorMessages);

//Rutas de la app
app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/register',registerRouter);
app.use(sessionManager.guard); 
app.use('/profile',profileRouter);
app.use('/products',productRouter); //Reparar la paginacion al filtrado


app.use((req,res,next)=>{   
    //Registro de error 404 
    next(createHttpError(404))
});


app.use((err,req,res,next)=>{
    console.log(err);
    
    if(err.array){
        if (req.url.startsWith('/products/')) {            
            const errors = err.array().map(e =>`${e.path} ${e.msg}`)
            const title = `We can´t ${req.url.split('/')[2]} product`
            req.flash('error',errors);            
            res.redirect('/products')
            return
        }
    }

    // Atrapando error 404
    if (err.status === 404) {
        res.status(404).render('404');
        return 
    }

    //Respuesta para resto de errores
    res.locals.error = err
    res.status(err.status || 500).render('error');
})


export default app;