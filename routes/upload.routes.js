import express from "express";
import {
  uploadImages,
  uploadImage,
  deleteImage,
} from "../controllers/upload.controller.js";
import upload from "../utils/upload.js";

const router = express.Router();

/**
 * @route POST /api/upload/images
 * @desc Upload list of images
 * @access private (Admin only)
 */
router.post("/upload/images", upload.array("images"), uploadImages);

/**
 * @route POST /api/upload/images
 * @desc Upload an image
 * @access private (Admin only)
 */
router.post("/upload/image", upload.single("image"), uploadImage);

/**
 * @route DELETE /api/upload/images/:filename
 * @desc Delete an image
 * @access private (Admin only)
 */
router.delete("/upload/images/:filename", deleteImage);

export default router;
