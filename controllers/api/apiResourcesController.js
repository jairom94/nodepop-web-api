import Tag from "../../models/Tag.js"


/**
 * @openapi
 * /api/resources/tags:
 *   get:
 *     summary: Obtiene todos los tags disponibles
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: Lista de tags obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               tags:
 *                 - _id: "6873113b"
 *                   name: "work"
 *       500:
 *         description: Error interno del servidor
 * 
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next 
 */
export async function TagsResource(req,res,next) {
    try {
        const tags = await Tag.find()
        .select('-__v');
        res.json({tags})
    } catch (error) {
        next(error)
    }
}