import Product from "../models/Product.js";
import Tag from "../models/Tag.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import * as funcTools from "../lib/funcTools.js";

import { validationResult } from "express-validator";

export const productDetail = async (req, res, next) => {
  try {
    const { productID } = req.params;
    const product = await Product.findOne({ _id: productID }).populate(
      "tags",
      "name -_id"
    );
    console.log(product);

    res.locals.product = product;
    res.render("product");
  } catch (error) {
    next(error);
  }
};

export const productsGet = async (req, res, next) => {
  try {
    const user = req.session.userID;

    const { name, tags, limit, skip, sort } = req.query;
    const filter = {
      owner: user,
      // Sólo añade `name` si name !== undefined
      ...(!!name && { name }),
      ...(!!tags && { tags }),
    };

    const options = {
      // Convierte limit y skip a número si existen
      ...(!!limit && { limit: parseInt(limit, 10) }),
      ...(!!skip && { skip: parseInt(skip, 10) }),
      ...(!!sort && { sort }),
    };

    const products = await Product.list({ filter, ...options });
    // console.log({filter,limit,skip,sort});
    console.log(products);

    res.locals.products = products;
    res.render("products");
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    //validaciones
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
      validations.throw();
    }
    //lógica para add
    const { name, price, image, tags } = req.body;
    const tagsArray = typeof tags === "string" ? [tags] : tags ?? [];
    // const user = await User.findById(req.session.userID);
    const tagsDB = await Tag.find();
    const newProduct = {
      name,
      price,
      owner: req.session.userID,
      image,
      tags: tagsArray.map((tag_name) => funcTools.getTagID(tagsDB, tag_name)),
    };
    console.log(newProduct);
    const productInsert = await Product.insertOne(newProduct);
    console.log(productInsert);
    res.redirect("/products");
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
    const { allow } = req.query;
    if (allow) {
      const productDelete = await Product.deleteOne({ _id: id });
      console.log(productDelete);
      res.redirect("/products");
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
