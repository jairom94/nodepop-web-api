import { body } from "express-validator";



export const validateProductPost = [
    body('name')
    .notEmpty().withMessage('is required')
    .isLength({min:5,max:100}).withMessage('min 5 and max 100 characters'),
    body('price')
    .notEmpty().withMessage('is required')
    .isFloat({gt:0}).withMessage('must be greater than 0'),
    body('tags')        
    .custom((tags)=> typeof tags === 'string' || (Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && tag.trim() !== '')))
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
    .custom((tags)=> typeof tags === 'string' || (Array.isArray(tags) && tags.every(tag => typeof tag === 'string' && tag.trim() !== '')))
        .withMessage('must be string or array not empty')
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