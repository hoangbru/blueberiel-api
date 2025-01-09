import express from "express";
import {
  create,
  list,
  show,
  update,
  remove,
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Admin only)
 */
router.post("/products", create);

/**
 * @route GET /api/products
 * @desc Get a list of all products
 * @access Public
 */
router.get("/products", list);

/**
 * @route GET /api/product/:identifier
 * @desc Get a specific product by slug or ID
 * @access Public
 */
router.get("/product/:identifier", show);

/**
 * @route PUT /api/product/:id
 * @desc Update a specific product by ID
 * @access Private (Admin only)
 */
router.put("/product/:id", update);

/**
 * @route DELETE /api/product/:id
 * @desc Delete a specific product by ID
 * @access Private (Admin only)
 */
router.delete("/product/:id", remove);

export default router;
