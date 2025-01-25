import express from "express";
import { list, remove, show, update } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
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
 *         description: Search users by name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort users by price or name
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Error fetching users
 * @route GET /api/users
 * @desc Get a list of all users
 * @access private (Admin only)
 */
router.get("/users", authMiddleware, list);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * @route GET /api/user/:id
 * @desc Get a specific user by ID
 * @access private (Authenticated)
 */
router.get("/user/:id", authMiddleware, show);

/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update a specific user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
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
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * @route PUT /api/user/:id
 * @desc Update a specific user by ID
 * @access private (Authenticated)
 */
router.patch("/user/:id", authMiddleware, update);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete a specific user by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * @route DELETE /api/user/:id
 * @desc Delete a specific user by ID
 * @access private (Authenticated)
 */
router.delete("/user/:id", authMiddleware, remove);

export default router;
