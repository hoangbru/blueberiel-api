import Category from "../models/category.js";
import { categoryValidationSchema } from "../schemas/category.js";

/**
 * @desc Create a new category
 * @route /api/categories
 * @method POST
 */
export const create = async (req, res) => {
  const { name, description } = req.body;

  try {
    const { error } = categoryValidationSchema.validate(
      { name, description },
      { abortEarly: false }
    );
    if (error) {
      return res.json({
        message: error.details[0].message,
      });
    }

    const category = await Category.create({ name, description });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

/**
 * @desc Get all categories
 * @route /api/categories
 * @method GET
 */
export const list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      message: "Error retrieving categories",
      error: error.message || error,
    });
  }
};

/**
 * @desc Get a single category by ID
 * @route /api/categories/:id
 * @method GET
 */
export const show = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      message: "Error retrieving category",
      error: error.message || error,
    });
  }
};

/**
 * @desc Update an existing category by ID
 * @route /api/categories/:id
 * @method PATCH
 */
export const update = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const { error } = categoryValidationSchema.validate({ name, description });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Error updating category",
      error: error.message || error,
    });
  }
};

/**
 * @desc Delete a category by ID
 * @route /api/categories/:id
 * @method DELETE
 */
export const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      message: "Error deleting category",
      error: error.message || error,
    });
  }
};
