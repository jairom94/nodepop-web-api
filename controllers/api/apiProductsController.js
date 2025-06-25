import Product from "../../models/Product.js";

/**
 * @openapi
 * tags:
 *  - name: store
 *  - description: Sell and buy products
 * /api/products:
 *   get:
 *     tags:
 *        - store
 *     security:
 *       - tokenAuth: []
 *     description: Return a list of products
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
    const userId = req.apiUserId

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
