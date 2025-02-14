import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { categoryValidationSchema } from "../schemas/category.js";

/**
 * @desc Create a new category
 * @route POST /api/categories
 * @access private
 */
export const create = async (req, res) => {
  const { name, description } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      meta: { message: "Unauthorized user", errors: true },
    });
  }

  try {
    const { error } = categoryValidationSchema.validate(
      { name, description },
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

    const category = await Category.create({ name, description });
    res.status(201).json({
      meta: { message: "Category created successfully" },
      data: { category },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      meta: {
        message: "Error creating category",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Get all categories
 * @route GET /api/categories
 * @access public
 */
export const list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      meta: { message: "Categories retrieved successfully" },
      data: { categories },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      meta: {
        message: "Error retrieving categories",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Get a single category by ID
 * @route GET /api/categories/:id
 * @access public
 */
export const show = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        meta: { message: "Category not found", errors: true },
      });
    }

    res.status(200).json({
      meta: { message: "Category retrieved successfully" },
      data: { category },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      meta: {
        message: "Error retrieving category",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Update an existing category by ID and update related products
 * @route PUT /api/category/:id
 * @access private
 */
export const update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      meta: { message: "Unauthorized user", errors: true },
    });
  }

  try {
    const { error } = categoryValidationSchema.validate({ name, description });
    if (error) {
      return res.status(400).json({
        meta: {
          message: "Validation errors",
          errors: error.details.map((err) => err.message),
        },
      });
    }

    // Update the category
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        meta: { message: "Category not found", errors: true },
      });
    }

    // Update related products
    await Product.updateMany(
      { category: id },
      { category: { _id: id, name: category.name } }
    );

    res.status(200).json({
      meta: { message: "Category and related products updated successfully" },
      data: { category },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      meta: {
        message: "Error updating category",
        errors: error.message || error,
      },
    });
  }
};

/**
 * @desc Delete a category and remove the category reference from related products
 * @route DELETE /api/categories/:id
 * @access private
 */
export const remove = async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      meta: { message: "Unauthorized user", errors: true },
    });
  }

  try {
    // Delete the category
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        meta: { message: "Category not found", errors: true },
      });
    }

    // Remove the category reference from related products
    await Product.updateMany({ category: id }, { $set: { category: null } });

    res.status(200).json({
      meta: {
        message: "Category deleted and related products updated successfully",
      },
      data: { category: null },
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      meta: {
        message: "Error deleting category",
        errors: error.message || error,
      },
    });
  }
};
