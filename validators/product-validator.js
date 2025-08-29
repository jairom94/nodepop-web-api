import { body } from "express-validator";
import Tag from "../models/Tag.js";



export const validateProductPost = [
    body('name')
    .notEmpty().withMessage('is required')
    .isLength({min:5,max:100}).withMessage('min 5 and max 100 characters'),
    body('price')
    .notEmpty().withMessage('is required')
    .isFloat({gt:0}).withMessage('must be greater than 0'),
    body('tags')        
    .custom((tags)=> 
        typeof tags === 'string' 
        || (Array.isArray(tags) && tags.every(tag => 
            typeof tag === 'string' && tag.trim() !== ''
            || typeof tag === 'object' && tag !== null && '_id' in tag && 'name' in tag
        )))
        .withMessage('must be string or array not empty')
]


export const validateProductPut = [
    body('name')
    .notEmpty().withMessage('is required')
    .isLength({min:5,max:100}).withMessage('min 5 and max 100 characters'),
    body('price')
    .notEmpty().withMessage('is required')
    .isFloat({gt:0}).withMessage('must be greater than 0'),
    body('tags')
    .customSanitizer((value)=> {        
        if(typeof value === 'string'){
            if(value === ''){
                return []
            }
            return value.split(',').map(tag=>tag.trim())
        }
        return value
    })
    .custom(async (value)=>{
        if(!Array.isArray(value)){
            throw new Error('must be array type')
        }
        if(value.length === 0){
            throw new Error('must be choose almost one tag')
        }
        const areString = value.every(item => typeof item === 'string')
        // console.log(areString,'validacion de tags');        
        if(!areString){
            throw new Error('must has tags on format string')
        }
        const tags = await Tag.listByField('name -_id')
        const listTags = tags.map(t=>t.name)        
        if(!value.every(item => listTags.includes(item))){
            throw new Error('almost one tag not exist')
        }
        return true
    })
]


export const validateProductPatch = [
    body('name')
    .optional()
    .notEmpty().withMessage('is required')
    .isLength({min:5,max:100}).withMessage('min 5 and max 100 characters'),
    body('price')
    .optional()
    .notEmpty().withMessage('is required')
    .isFloat({gt:0}).withMessage('must be greater than 0'),
    body('tags')
    .optional()
    .custom((tags)=> typeof tags === 'string' || (Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && tag.trim() !== '')))
        .withMessage('must be string or array not empty')
]