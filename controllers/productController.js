import Product from "../models/Product.js";
import Tag from "../models/Tag.js";
import User from "../models/User.js";
import mongoose from 'mongoose';
import * as funcTools from '../lib/funcTools.js';

import { validationResult } from 'express-validator';


export const productDetail = async (req, res, next) => {
    try {
        const { productID } = req.params;
        const product = await Product.findOne({ _id: productID })
            .populate('tags', 'name -_id');
        console.log(product);
        
        res.locals.product = product
        res.render('product')        
    } catch (error) {        
        next(error)
    }
}

export const productsGet = async (req, res, next) => {
    try {        
        // const { name, min, max, tags } = req.query;
        const fields = ['name','min','max','tags'];
        const existQuery = fields.some((field)=>req.query[field])
        const user = req.session.userID;
        let query = { owner:user }
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const items = 6;
        let nextPage = '';        
        

        const [minMax] = await Product.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(user)
                }
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);
        let nameFilter = '';
        let startMin = minMax.minPrice;
        let startMax = minMax.maxPrice;
        let tagsFilter = []
        if(existQuery){
            const queryFilter = funcTools.QueryFilter();
            queryFilter.filterUser(user);
            queryFilter.setreqQuery(req.query);
            await queryFilter.buildQuery();
            query = queryFilter.getQuery();
            // console.log(req.url)
            const params = req.query;            
            delete params['page']
            const queryString = new URLSearchParams(params).toString();            
            nextPage += `&${queryString}`;
            startMin = req.query.min;
            startMax = req.query.max;
            tagsFilter = Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags];
            nameFilter = req.query.name ?? ''
        }
        const products = await Product.find(query)
            .skip((page - 1) * items)
            .limit(items)
            .populate('tags', 'name -_id');
        const totalDocs = await Product.find(query).countDocuments();
        const totalPages = Math.ceil(totalDocs / items);

        
        res.locals.rangePrice = minMax
            ? { min: minMax.minPrice, max: minMax.maxPrice }
            : { min: 0, max: 100 }
        res.locals.startRange = {
            startMin,
            startMax
        }
        res.locals.tagsFilter = tagsFilter;
        res.locals.nameFilter = nameFilter;

        res.locals.pagination = {
            products,
            page,
            totalPages,
            totalItems: totalDocs,
            nextPage,
            prevPage:nextPage,            
        }
        res.locals.tags = await Tag.find();
        res.render('products')
    } catch (error) {
        next(error)
    }
}

export const addProduct = async (req, res, next) => {
    try {
        //validaciones
        const validations = validationResult(req);
        if (!validations.isEmpty()) {
            validations.throw()
        }
        //lógica para add
        const { name, price, image, tags } = req.body
        const tagsArray = (typeof tags === 'string')
            ? [tags]
            : tags
            ?? [];
        // const user = await User.findById(req.session.userID);
        const tagsDB = await Tag.find();
        const newProduct = {
            name,
            price,
            owner: req.session.userID,
            image,
            tags: tagsArray.map(tag_name => funcTools.getTagID(tagsDB, tag_name))
        }
        console.log(newProduct)
        const productInsert = await Product.insertOne(newProduct);
        console.log(productInsert)
        res.redirect('/products');
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
        try {
            const resultValidations = validationResult(req);
            if (!resultValidations.isEmpty()) {
                resultValidations.throw()
            }
            const { id } = req.params;
            const { allow } = req.query;
            if (allow) {
                const productDelete = await Product.deleteOne({ _id: id })
                console.log(productDelete)
                res.redirect('/products')
            }
        } catch (error) {
            next(error)
        }
    }

export const updateProduct = async (req,res,next) => {
    try {
        const { id } = req.params;
        const { name, price, image, tags } = req.body;
        const tagsDB = await Tag.find();
        const tagsArray = (typeof tags === 'string')
            ? [tags]
            : tags
            ?? [];
        await Product.updateOne(
            {_id:id},
            {
                $set:{
                    name,
                    price,
                    image,
                    tags: tagsArray.map(tag_name => funcTools.getTagID(tagsDB, tag_name))
                }                
            }
        )        
        res.redirect('/products')
    } catch (error) {
        next(error)
    }
}