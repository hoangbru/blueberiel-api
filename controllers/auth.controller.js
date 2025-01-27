import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../schemas/auth.js";

/**
 * @desc Register a new user
 * @route /api/auth/register
 * @method POST
 * @access Public
 */
export const register = async (req, res) => {
  const { username, email, password, phone, address, avatar } = req.body;

  try {
    const { error } = registerValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        meta: {
          message: "Validation errors",
          errors: error.details.map((err) => err.message),
        },
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        meta: { message: "Email is already in use" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      avatar,
    });

    res.status(201).json({
      meta: { message: "User registered successfully" },
      data: {
        user: { id: user.id, username: user.username, email: user.email },
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      meta: {
        message: "Error registering user",
        error: error.message || error,
      },
    });
  }
};

/**
 * @desc Login user
 * @route /api/auth/login
 * @method POST
 * @access Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = loginValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        meta: {
          message: "Validation errors",
          errors: error.details.map((err) => err.message),
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        meta: { message: "Invalid email or password" },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        meta: { message: "Invalid email or password" },
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      meta: { message: "Login successful" },
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email },
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      meta: { message: "Error logging in", error: error.message || error },
    });
  }
};

/**
 * @desc Get user profile
 * @route /api/auth/profile
 * @method GET
 * @access Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        meta: { message: "User not found" },
      });
    }

    res.status(200).json({
      meta: { message: "User profile retrieved successfully" },
      data: { user },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      meta: {
        message: "Error fetching profile",
        error: error.message || error,
      },
    });
  }
};
