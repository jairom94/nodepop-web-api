import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import createHttpError from 'http-errors'

/**
  * @openapi
 * /api/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Login de usuario y genera un JWT
 *     description: Autentica al usuario con email y contraseña y retorna un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokenJWT:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
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