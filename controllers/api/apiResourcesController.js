import Tag from "../../models/Tag.js"


/**
 * 
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next 
 */
export async function TagsResource(req,res,next) {
    try {
        const tags = await Tag.find()
        res.json({tags})
    } catch (error) {
        next(error)
    }
}