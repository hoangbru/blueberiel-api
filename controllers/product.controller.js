import mongoose from "mongoose";

import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { productValidationSchema } from "../schemas/product.js";

/**
 * @desc Create a new product
 * @route POST /api/products
 * @access private
 */
export const create = async (req, res) => {
  const { name, description, price, category, rating, variants, images } =
    req.body;

  try {
    const { error } = productValidationSchema.validate(
      { name, description, price, category, rating, variants, images },
      { abortEarly: false }
    );
    if (error) {
      return res.status(400).json({
        meta: {
          message: "Validation errors",
          errors: error.details.map((err) => err.message),
        },
      });
    }

    const calculatedStock = Array.isArray(variants)
      ? variants.reduce((total, variant) => total + (variant.stock || 0), 0)
      : 0;

    const product = await Product.create({
      name,
      description,
      price,
      images: images ? images : [],
      stock: calculatedStock,
      category,
      rating: rating ? rating : { average: 0, count: 0 },
      variants: variants ? variants : [],
    });

    res.status(201).json({
      meta: { message: "Product created successfully" },
      data: { product },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      meta: {
        message: "Error creating product",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Get all products (with pagination, category filter, search, sort, price range filter, and size filter)
 * @route GET /api/products?page=&limit=&search=&sort=&minPrice=&maxPrice=&category=&size=
 * @access public
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
    size,
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

    // Filter by size in variants
    if (size) {
      query.variants = {
        $elemMatch: {
          size: size,
        },
      };
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
      meta: { message: "Products retrieved successfully" },
      data: {
        products,
        pagination: {
          itemsPerPage: parseInt(limit),
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProducts / limit),
          totalItems: totalProducts,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      meta: {
        message: "Error fetching products",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Get product by slug or ID
 * @route GET /api/product/:identifier
 * @access public
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
      return res
        .status(404)
        .json({ meta: { message: "Product not found", errors: true } });
    }

    res.status(200).json({
      meta: { message: "Product retrieved successfully" },
      data: { product },
    });
  } catch (error) {
    console.error("Error fetching product by identifier:", error);
    res.status(500).json({
      meta: {
        message: "Error fetching product",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Update product
 * @route PUT /api/product/:id
 * @access private
 */
export const update = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    stock,
    category,
    rating,
    variants,
    images,
  } = req.body;

  try {
    const { error } = productValidationSchema.validate(
      { name, description, price, stock, category, rating, variants, images },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        meta: {
          message: "Validation errors",
          errors: error.details.map((err) => err.message),
        },
      });
    }

    const categoryRef = await Category.findById(category);
    if (!categoryRef) {
      return res
        .status(404)
        .json({ meta: { message: "Category not found", errors: true } });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, category, rating, variants, images },
      { new: true }
    ).populate("category", "name");

    if (!product) {
      return res
        .status(404)
        .json({ meta: { message: "Product not found", errors: true } });
    }

    res.status(200).json({
      meta: { message: "Product updated successfully" },
      data: { product },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      meta: {
        message: "Error updating product",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Delete product
 * @route DELETE /api/product/:id
 * @access private
 */
export const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ meta: { message: "Product not found", errors: true } });
    }

    res.status(200).json({
      meta: { message: "Product deleted successfully" },
      data: { product: null },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      meta: {
        message: "Error deleting product",
        errors: error.message || error,
      },
    });
  }
};
