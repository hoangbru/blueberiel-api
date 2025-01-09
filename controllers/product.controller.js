import mongoose from "mongoose";

import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { productValidationSchema } from "../schemas/product.js";

/**
 * @desc Create a new product
 * @route /api/products
 * @method POST
 */
export const create = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  console.log(req.body);

  try {
    const { error } = productValidationSchema.validate(
      { name, description, price, category, stock },
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
      stock,
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
 * @desc Get all products (with pagination, category filter, search, sort, and price range filter)
 * @route GET /api/products?page=&limit=&search=&sort=price&minPrice=&maxPrice=&category=
 * @access Public
 */
export const list = async (req, res) => {
  const {
    page = 1,
    limit = 9,
    search = "",
    sort = "",
    minPrice,
    maxPrice,
    category,
  } = req.query;

  try {
    // Create a query object for filters
    let query = {};

    // Search by product name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Sorting options
    let sortOptions = {};
    if (sort === "price") {
      sortOptions.price = 1; // Sort by price (ascending)
    } else if (sort === "-price") {
      sortOptions.price = -1; // Sort by price (descending)
    } else if (sort === "name") {
      sortOptions.name = 1; // Sort by name (A-Z)
    } else if (sort === "-name") {
      sortOptions.name = -1; // Sort by name (Z-A)
    } else if (sort === "date") {
      sortOptions.createdAt = -1; // Sort by date (newest first)
    }

    // Fetch products with filters, pagination, and sorting
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name");

    // Count total products based on the query
    const totalProducts = await Product.countDocuments(query);

    // Response
    res.status(200).json({
      products,
      itemsPerPage: products.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
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
 * @desc Get product by slug or ID
 * @route /api/product/:identifier
 * @method GET
 */
export const show = async (req, res) => {
  const { identifier } = req.params;

  try {
    let product;

    // Check if the identifier is a valid ObjectId (for ID lookup)
    if (mongoose.isValidObjectId(identifier)) {
      product = await Product.findById(identifier).populate("category", "name");
    } else {
      // Otherwise, treat it as a slug
      product = await Product.findOne({ slug: identifier }).populate(
        "category",
        "name"
      );
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by identifier:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message || error,
    });
  }
};

/**
 * @desc Update product
 * @route /api/product/:id
 * @method PUT
 */
export const update = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, stock } = req.body;

  try {
    const { error } = productValidationSchema.validate(
      { name, price, description, category, stock },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const categoryRef = await Category.findById(category);
    if (!categoryRef) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, stock },
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
