import express from 'express';
import User from '../models/User.js';

const router = express.Router();


router.get('/', async (req, res, next) => {
    try {      
        if(req.session.userID){
            res.redirect('/profile');
            return
        }  
        res.render('register')
    } catch (error) {
        next(error)
    }
});

router.post('/', async (req,res,next) => {
    try {
        const { name,lastname,email,password } = req.body;        
        const user = await User.insertOne({
            name,
            lastname_1:lastname,
            email,
            password: await User.hashPassword(password)
        })
        req.session.fullname = `${user.name} ${user.lastname_1}`
        req.session.userID = user._id
        res.redirect('/products')
    } catch (error) {
        next(error);
    }
})

export default router;