import session from "express-session";
import MongoStore from "connect-mongo";

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2;

export const middleware = session({
    name:'nodepop-session',
    secret:'N)f3AF^B?w42yC6cKku->j7&aT!MhW@t9vY/e',
    saveUninitialized:true,
    resave:false,
    cookie:{
        maxAge: INACTIVITY_EXPIRATION_2_DAYS
    },
    store:MongoStore.create({
        mongoUrl:'mongodb://localhost:27017/cursonode',
    })
});

export const useSessionInViews = (req,res,next) => {
    res.locals.session = req.session;
    next();
}

export const guard =(req,res,next)=>{    
    if(!req.session.userID){
        res.redirect(`/login?from=${req.url}`)
        return
    }
    next()
    // else{
    //     console.log(req.url)
    //     if(req.url.startsWith('/register') || req.url.startsWith('/login')){
    //         console.log('Ya esta logeado')
    //         res.redirect('/')
    //         // res.redirect(`${req.url}`);
    //         return
    //     }
    // }
    // else if (req.session.userID && req.url.includes('/register')) {
    //     res.redirect('/products');
    //     return
    // } else if (req.session.userID && req.url.includes('/login')){
    //     res.redirect('/products');
    //     return
    // }
}
