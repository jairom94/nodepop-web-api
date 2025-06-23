import Tag from "../models/Tag.js"

export async function getCategories(req,res,next){
    const rawCategories = await Tag.listByField('name') ?? []
    let clearCategories = [];
    if (rawCategories.length > 0) {
        clearCategories = rawCategories.map(cat => cat.name)
    }
    res.locals.headerCategories = clearCategories  
    // console.log(clearCategories);
      
    next()
}