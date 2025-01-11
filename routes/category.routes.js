import express from "express";
import {
  create,
  list,
  show,
  update,
  remove,
} from "../controllers/category.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing categories
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Category for electronic products
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private (Admin only)
 */
router.post("/categories", create);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get a list of all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *       500:
 *         description: Internal server error
 * @route GET /api/categories
 * @desc Get a list of all categories
 * @access Public
 */
router.get("/categories", list);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get a specific category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 * @route GET /api/category/:id
 * @desc Get a specific category by ID
 * @access Public
 */
router.get("/category/:id", show);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a specific category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Electronics
 *               description:
 *                 type: string
 *                 example: Updated description for electronics
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 * @route PUT /api/category/:id
 * @desc Update a specific category by ID
 * @access Private (Admin only)
 */
router.put("/category/:id", update);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a specific category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 * @route DELETE /api/category/:id
 * @desc Delete a specific category by ID
 * @access Private (Admin only)
 */
router.delete("/category/:id", remove);

export default router;
