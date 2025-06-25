import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import createHttpError from 'http-errors'


export async function loginJWT(req,res,next) {
    try {
        const { email,password } = req.body
        const user = await User.findOne({email})

        if(!user || !(await user.comparePassword(password))){
            next(createHttpError(401,'Invalid credentials'))
            return
        }
        jwt.sign({user_id:user.id},process.env.JWT_SECRET,{
            expiresIn:'2d'
        },(err,tokenJWT)=>{
            if(err) return next(err)
            
            res.json({tokenJWT})
        })

            

    } catch (error) {
        next(error)
    }
}