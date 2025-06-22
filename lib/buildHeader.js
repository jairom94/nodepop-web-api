import Tag from "../models/Tag.js"

export function getCategories(req,res,next){
    const rawCategories = Tag.find().then(data => data) ?? []
    res.locals.headerCategories = rawCategories    
    next()
}