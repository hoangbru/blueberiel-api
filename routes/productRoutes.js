import express from "express";
import {
  create,
  list,
  show,
  update,
  remove,
  uploadImages
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Admin only)
 */
router.post("/products", create);

/**
 * @route POST /api/products/upload
 * @desc Create a new product
 * @access Private (Admin only)
 */
router.post('/products/upload', uploadImages, (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  res.status(200).json({ message: 'Files uploaded successfully', files: req.files });
});

/**
 * @route GET /api/products
 * @desc Get a list of all products
 * @access Public
 */
router.get("/products", list);

/**
 * @route GET /api/product/:slug
 * @desc Get a specific product by slug
 * @access Public
 */
router.get("/product/:slug", show);

/**
 * @route PATCH /api/product/:id
 * @desc Update a specific product by ID
 * @access Private (Admin only)
 */
router.patch("/product/:id", update);

/**
 * @route DELETE /api/product/:id
 * @desc Delete a specific product by ID
 * @access Private (Admin only)
 */
router.delete("/product/:id", remove);

export default router;
