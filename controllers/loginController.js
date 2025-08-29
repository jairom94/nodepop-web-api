import User from '../models/User.js';

export const logginPost = async (req, res, next) => {
    try {
        const { email, password } = req.body;        
        const user = await User.findOne({ email: email })
        
        if (!user || !(await user.comparePassword(password))) {
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            return res.status(401).render('login')            
        }
        // console.log(`${user.name} ${user.lastname_1}`);
        
        req.session.fullname = `${user.name} ${user.lastname_1}`
        req.session.userID = user._id
        req.session.user = {
            id:user._id,
            fullname:`${user.name} ${user.lastname_1}`
        }
        const to = req.query.from ?? '/'
        res.redirect(to)
    } catch (error) {
        next(error)
    }
}

export const logginGet = (req, res, next) => {
    res.locals.error = '';
    res.locals.email = '';       
    if(req.session.userID){
        // console.log(req.session.userID);
        
        res.redirect('/profile');
        return
    }
    res.render('login');
}

export const logout = (req,res,next)=>{
    req.session.regenerate((err)=>{
        if(err){
            next(err)
            return
        }
        res.redirect("/");       
    })
}