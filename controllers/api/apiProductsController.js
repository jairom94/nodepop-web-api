import {
  deleteFileIfExist,
  deleteImageThumbnailProduct,
  getTagID,
  parseToArray,
  validationWithFile,
  validationWithoutFile,
} from "../../lib/funcTools.js";
import Product from "../../models/Product.js";
import { validationResult } from "express-validator";
import Tag from "../../models/Tag.js";
import createHttpError from "http-errors";
import cote from 'cote';

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *        - Products
 *     summary: Muestra la lista de productos según el usuario
 *     security:
 *       - tokenAuth: []
 *     description: Retorna un array de productos
 *     responses:
 *       200:
 *         description: Returns a list of products.
 *         content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                      $ref: '#/components/schemas/Product'
 *
 * components:
 *  schemas:
 *    Product:
 *     type: object
 *     properties:
 *      id:
 *         type: string
 *         example: adasdasdqw312sasd
 *      name:
 *          type: string
 *          example: Televisor Samsung
 *      price:
 *          type: float
 *          example: 300.50
 *      image:
 *          type: string
 *          example: imagen.png
 *      tags:
 *          type: array
 *          items:
 *              type: string
 *          example: ['work','lifestyle']
 *  securitySchemes:
 *    tokenAuth:
 *      type: apiKey
 *      in: header
 *      name: Authorization
 *
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function list(req, res, next) {
  try {
    const userId = req.apiUserId;

    const { name, tags, limit, skip, sort } = req.query;
    const filter = {
      owner: userId,
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
    const result = { results: products };
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * @openapi
 * /api/products/{productId}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Obtener un producto por ID
 *     description: Retorna un único producto si pertenece al usuario autenticado.
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: string
 *           example: 64fdde2b99dcd73d14abcf5e
 *     responses:
 *       200:
 *         description: Producto encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     image:
 *                        type: string
 *                     tags:
 *                        type: array
 *                        items:
 *                            type: string
 *                        example: ['work','lifestyle']
 *                     owner:
 *                       type: string
 *       404:
 *         description: Producto no encontrado o no pertenece al usuario
 *       500:
 *         description: Error interno del servidor
 *
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function getOne(req, res, next) {
  try {
    const productId = req.params.productId;
    const userId = req.apiUserId || req.session.userID;

    const product = await Product.findOne({ _id: productId, owner: userId })
    .populate('tags');
    res.json({ result: product });
  } catch (error) {
    next(error);
  }
}

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Crea un nuevo producto para el usuario autenticado
 *     tags:
 *       - Products
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: string
 *                 description: Lista separada por comas
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function newProduct(req, res, next) {
  try {
    const validations = validationResult(req);
    if (!validations.isEmpty() || !req.file) {
      const newError = {
        type: "field",
        value: undefined,
        msg: "is required",
        path: "image",
        location: "body",
      };
      validationWithFile(req, validations, newError);
    }

    const tagsDB = await Tag.find();

    const userId = req.apiUserId;
    const productRaw = req.body;
    
    const { tags } = req.body;
    const product = new Product(productRaw);
    product.owner = userId;
    product.image = req.file.filename;
    product.tags = parseToArray(tags).map((tag_name) =>
      getTagID(tagsDB, tag_name)
    );
    const savedProduct = await product.save();

    //creacion thumbnail
    const requester = new cote.Requester({
      name: "app",
    });
    
    const event = {
      type: "create",
      productId: savedProduct.id,
      imagePath: req.file.path,
    };

    requester.send(event, (err, result) => {
      if (err) {
        console.log("ERROR:", err);
        return;
      }
      console.log("resultado:", result);
    });

    res.status(201).json({ result: savedProduct });
  } catch (error) {
    next(error);
  }
}

/**
 * @openapi
 * /products/{productId}:
 *   put:
 *     summary: Actualiza un producto del usuario autenticado
 *     tags:
 *       - Products
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: string
 *                 description: Lista separada por comas
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function update(req, res, next) {  
  try {
    const validations = validationResult(req);
    const newError = {
      type: "field",
      value: undefined,
      msg: "is required",
      path: "image",
      location: "body",
    };
    validationWithFile(req, validations, newError);
    const tagsDB = await Tag.find();
    const userId = req.apiUserId;
    const productId = req.params.productId;
    const productRaw = req.body;
    productRaw.image = req.file.filename;
    productRaw.tags = parseToArray(productRaw.tags).map((tag_name) =>
      getTagID(tagsDB, tag_name)
    );

    const updateProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        owner: userId,
      },
      productRaw,
      {
        new: true,
      }
    );
    res.json({ result: updateProduct });
  } catch (error) {
    next(error);
  }
}

/**
 * @openapi
 * /products/{productId}:
 *   patch:
 *     summary: Actualiza parcialmente un producto del usuario autenticado
 *     tags:
 *       - Products
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               tags:
 *                 type: string
 *                 description: Lista separada por comas o array de strings
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (opcional)
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 *
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function partialUpdate(req, res, next) {  
  try {    
    const validations = validationResult(req);
    validationWithoutFile(validations);
    const tagsDB = await Tag.find();
    const userId = req.apiUserId || req.session.userID;;
    const productId = req.params.productId;
    const productRaw = req.body;
    
    
    if (req.file) {
      productRaw.image = req.file.filename;
    }
    if (typeof productRaw.tags === "string" || Array.isArray(productRaw.tags)) {
      const tagsRaw = parseToArray(productRaw.tags)                
      if(tagsRaw.every(t => Product.isObjectId(t))){
        productRaw.tags = tagsRaw
      }else{
        productRaw.tags = tagsRaw.map((tag_name) =>
          getTagID(tagsDB, tag_name)
        );
      }
      
    }

    const updateProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        owner: userId,
      },
      productRaw,
      {
        new: true,
      }
    );
    res.json({ result: updateProduct });
  } catch (error) {
    next(error);
  }
}

/**
 * @openapi
 * /products/{productId}:
 *   delete:
 *     summary: Elimina un producto del usuario autenticado
 *     tags:
 *       - Products
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nombre del producto deleted success"
 *       401:
 *         description: No autorizado para eliminar este producto
 *       404:
 *         description: Producto no encontrado
 *
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export async function deleteProduct(req, res, next) {
  try {
    const userId = req.apiUserId;
    const productId = req.params.productId;

    const searchedProduct = await Product.findById(productId);
    if (!searchedProduct) {
      return next(createHttpError(404, "product no found"));
    }
    if (searchedProduct.owner.toString() !== userId) {
      return next(createHttpError(401, "not allow this action"));
    }

    if (searchedProduct.image) {
      // deleteFileIfExist(`products/${searchedProduct.image}`);
      deleteImageThumbnailProduct(searchedProduct.image)
    }

    await Product.deleteOne({ _id: productId });

    res.json({ message: `${searchedProduct.name} deleted success` });
  } catch (error) {
    next(error);
  }
}
