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
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private (Admin only)
 */
router.post("/categories", create);

/**
 * @route GET /api/categories
 * @desc Get a list of all categories
 * @access Public
 */
router.get("/categories", list);

/**
 * @route GET /api/category/:id
 * @desc Get a specific category by ID
 * @access Public
 */
router.get("/category/:id", show);

/**
 * @route PUT /api/category/:id
 * @desc Update a specific category by ID
 * @access Private (Admin only)
 */
router.put("/category/:id", update);

/**
 * @route DELETE /api/category/:id
 * @desc Delete a specific category by ID
 * @access Private (Admin only)
 */
router.delete("/category/:id", remove);

export default router;
