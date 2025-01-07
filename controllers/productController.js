import Product from "../models/product.js";
import Category from "../models/category.js";
import { productValidationSchema } from "../schemas/product.js";
import uploadImage from '../utils/uploadImage.js';

/**
 * @desc Create a new product
 * @route /api/products
 * @method POST
 */
export const create = async (req, res) => {
  const { name, description, price, category, quantity, slug } = req.body;

  try {
    const { error } = productValidationSchema.validate(
      { name, description },
      { abortEarly: false }
    );
    if (error) {
      return res.json({
        message: error.details[0].message,
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      quantity,
      slug,
      images: req.files ? req.files.map((file) => file.path) : [],
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message || error,
    });
  }
};

/**
 * @desc Upload product images
 * @route /api/products/upload
 * @method POST
 */
export const uploadImages = uploadImage.array("images", 5);

/**
 * @desc Get all products (with pagination and category name)
 * @route /api/products?page=1&limit=10
 * @method GET
 */
export const list = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name");

    const totalProducts = await Product.countDocuments();
    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message || error,
    });
  }
};

/**
 * @desc Get product by slug
 * @route /api/product/:slug
 * @method GET
 */
export const show = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug }).populate(
      "category",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message || error,
    });
  }
};

/**
 * @desc Update product
 * @route /api/product/:id
 * @method PATCH
 */
export const update = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, categoryId, stock } = req.body;

  try {
    const { error } = productValidationSchema.validate(
      { name, price, description, categoryId, stock },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category: categoryId, stock },
      { new: true }
    ).populate("category", "name");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message || error,
    });
  }
};

/**
 * @desc Delete product
 * @route /api/product/:id
 * @method DELETE
 */
export const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message || error,
    });
  }
};
