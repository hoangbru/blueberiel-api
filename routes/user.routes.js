import express from "express";
import { list, remove, show, update } from "../controllers/user.controller.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Private
 */
router.get("/users", checkPermission, list);

/**
 * @desc Get a single user by ID
 * @route GET /api/user/:id
 * @access Private
 */
router.get("/user/:id", checkPermission, show);

/**
 * @desc Update a user by ID
 * @route PATCH /api/user/:id
 * @access Private
 */
router.patch("/user/:id", checkPermission, update);

/**
 * @desc Delete a user by ID
 * @route DELETE /api/user/:id
 * @access Private
 */
router.delete("/user/:id", checkPermission, remove);

export default router;
