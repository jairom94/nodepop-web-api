import Product from "../models/Product.js";
import Tag from "../models/Tag.js";
import * as funcTools from "../lib/funcTools.js";

import { query, validationResult } from "express-validator";
import createHttpError from "http-errors";
import fs from 'node:fs/promises';
import path from "node:path";


export const productDetail = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const product = await Product.findOne({ _id: productID }).populate(
      "tags",
      "name -_id"
    );
    // console.log(product);

    res.locals.product = product;
    res.render("product");
  } catch (error) {
    next(error);
  }
};

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
export const productsGet = async (req, res, next) => {
  try {
    const user = req.session.userID;

    const { sort, page } = req.query;

    // console.log(req.query);
    
    
    const limit = 8
    const options = {
      // Convierte limit y skip a número si existen
      limit,
      skip: page ? ((page -1)*limit) : 0,
      ...(!!sort && { sort }),
    };

    const filters = await funcTools.buildProductFilters(req.query,user)
    // console.log({ filters, ...options });
    // console.log(filters)
    const count = await Product.countDocuments(filters)  
    // console.log('count',count)  

    if(count === 0){
      return next(createHttpError(404,'No hay productos para mostrar'))
    }

    const products = await Product.list({ filters, ...options });
    
    if(options.skip >= count){
      return next(createHttpError(404,'Productos no encontrados'))
    }
    
    res.locals.pages = Math.ceil(count/options.limit)
    res.locals.currentPage = page ?? 1

    res.locals.products = products;    

    const [priceRange] = await Product.priceRange(user)
    if (priceRange) {      
      res.locals.priceRange = priceRange
    }else{
      res.locals.priceRange = {
        minPrice:0,
        maxPrice:100
      }
    }
    
    // console.log(req.query);
    if(req.query.tags){
      req.query.tags = funcTools.parseToArray(req.query.tags)
    }else {
      req.query.tags = []
    }
    
    res.render("products",{query:req.query});
  } catch (error) {
    next(error);
  }
};


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export const addProduct = async (req, res, next) => {
  // console.log(req.body);

  try {
    //validaciones
    const validations = validationResult(req);
    if (!validations.isEmpty() || (!req.file && !req.body.imagePreview)) {
      const newError = {
        type: "field",
        value: undefined,
        msg: "is required",
        path: "image",
        location: "body",
      };
      // console.log('path de la imagen',req.file.path)
      funcTools.validationWithFile(req, validations, newError);
    }



    //lógica para add
    const { name, price, tags } = req.body;

    let image_;
    if(req.body.imagePreview){
      const [_,mimeType,imageBase64] = req.body.imagePreview.match(/^data:(.+);base64,(.+)$/);
      if(mimeType){
        const buffer = Buffer.from(imageBase64,'base64')
        const fileName = `${Date.now()}image.${mimeType.split('/')[1]}`
        const filePath = path.join(import.meta.dirname,'..','public','products',fileName)
        await fs.writeFile(filePath,buffer)
        image_ = fileName
        // console.log(fileName);
        req.file = {
          filename: fileName,
          path: filePath,
          mimeType,
        };
      }
    }else{
      image_ = req.file.filename;
    }
    const image = image_//req.file.filename;

    // const tagsDB = await Tag.find();
    const newProduct = {
      name,
      price,
      owner: req.session.userID,
      image,
      tags 
    };
    // console.log(newProduct);
    const productInsert = await Product.insertOne(newProduct);    
        

    res.redirect(`/products/${productInsert.id}`);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const resultValidations = validationResult(req);
    if (!resultValidations.isEmpty()) {
      resultValidations.throw();
    }
    const { id } = req.params;
    const { allow } = req.body;
    if (allow) {
      const searchedProduct = await Product.findById(id);
      await Product.deleteOne({ _id: id });
      await funcTools.deleteImageThumbnailProduct(searchedProduct.image)

      res.redirect("back");
    }
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, image, tags } = req.body;
    const tagsDB = await Tag.find();
    const tagsArray = typeof tags === "string" ? [tags] : tags ?? [];
    await Product.updateOne(
      { _id: id },
      {
        $set: {
          name,
          price,
          image,
          tags: tagsArray.map((tag_name) =>
            funcTools.getTagID(tagsDB, tag_name)
          ),
        },
      }
    );
    res.redirect("/products");
  } catch (error) {
    next(error);
  }
};
