import express from "express";
import {
  create,
  list,
  show,
  update,
  remove,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Product Name"
 *               description:
 *                 type: string
 *                 example: "Product description"
 *               price:
 *                 type: number
 *                 example: 100
 *               stock:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: "63f5b2a55c1b2b001e3d9c10"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Error creating product
 
 * @route POST /api/products
 * @desc Create a new product
 * @access private (Admin only)
 */
router.post("/products", protect, create);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get a list of all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 9
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort products by price or name
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Error fetching products
 * @route GET /api/products
 * @desc Get a list of all products
 * @access public
 */
router.get("/products", list);

/**
 * @swagger
 * /api/product/{identifier}:
 *   get:
 *     summary: Get a specific product by slug or ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID or slug
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error fetching product
 * @route GET /api/product/:identifier
 * @desc Get a specific product by slug or ID
 * @access public
 */
router.get("/product/:identifier", show);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 * @route PUT /api/product/:id
 * @desc Update a specific product by ID
 * @access private (Admin only)
 */
router.put("/product/:id", protect, update);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a specific product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 * @route DELETE /api/product/:id
 * @desc Delete a specific product by ID
 * @access private (Admin only)
 */
router.delete("/product/:id", protect, remove);

export default router;
