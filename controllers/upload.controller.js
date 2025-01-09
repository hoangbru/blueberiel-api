import fs from "fs";
import path from "path";
import fsPromise from "fs/promises";

/**
 * @desc Upload a list of images
 * @route POST /api/upload/images
 * @access Public
 */
export const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No images uploaded" });
  }

  try {
    const uploadedImages = req.newFiles.map(
      (filename) => `/uploads/${filename}`
    );
    const existingImages = req.existingFiles || [];

    return res.status(200).json({
      message: "Upload completed",
      uploadedImages,
      existingImages,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({
      message: "Error uploading images",
      error: error.message || "Internal Server Error",
    });
  }
};

/**
 * @desc Upload an image
 * @route POST /api/upload/image
 * @access Public
 */
export const uploadImage = async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Add uploaded images to the product's images array
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imagePaths,
    });
  } catch (error) {
    console.error("Error uploading product images:", error);
    res.status(500).json({
      message: "Error uploading product images",
      error: error.message || error,
    });
  }
};

/**
 * @desc Delete an image
 * @route DELETE /api/upload/images/:filename
 * @access Public
 */
export const deleteImage = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("./uploads", filename);

  try {
    // Check if the file already exists
    await fsPromise.access(filePath);

    // Delete file
    await fsPromise.unlink(filePath);

    return res
      .status(200)
      .json({ message: `Image ${filename} deleted successfully` });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({ message: `Image ${filename} not found` });
    }
    return res
      .status(500)
      .json({ message: "Error deleting image", error: error.message });
  }
};
