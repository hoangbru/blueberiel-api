import User from "../models/user.js";
import uploadImage from "../utils/uploadImage.js";

/**
 * @desc Upload user avatar
 * @route /api/users/avatar
 * @method POST
 */
export const uploadAvatar = uploadImage.single("avatar");

/**
 * @desc Update user avatar
 * @route /api/users/avatar
 * @method POST
 */
export const updateAvatar = async (req, res) => {
  const { userId } = req.body;
  const avatar = req.file ? req.file.path : null;

  if (!avatar) {
    return res.status(400).json({ message: "Avatar is required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Avatar updated successfully",
      user: {
        id: user._id,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({
      message: "Error updating avatar",
      error: error.message || error,
    });
  }
};

/**
 * @desc Get all products (with pagination and category name)
 * @route /api/products?page=1&limit=10
 * @method GET
 */
export const list = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const products = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name");

    const totalProducts = await User.countDocuments();
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
 * @desc Get a single category by ID
 * @route /api/categories/:id
 * @method GET
 */
export const show = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await User.findById(id);

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

    const category = await User.findByIdAndUpdate(
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
    const category = await User.findByIdAndDelete(id);

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
