import createHttpError from "http-errors";
import jwt from "jsonwebtoken";


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export function guard(req,res,next) {
    //Permitir acceso cuando el usuario tiene su sesion activada    
    if(req.session && req.session.userID){        
        return next()
    }

    const tokenJWT = req.get('Authorization') || req.body.jwt || req.query.jwt
    if(!tokenJWT){
        next(createHttpError(401,'no token provided'))
        return
    }
    jwt.verify(tokenJWT,process.env.JWT_SECRET,(err,payload)=>{
        if(err) return next(createHttpError(401,'invalid token'))

        req.apiUserId = payload.user_id
        next()
    })
}