import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware to protect routes (Authenticate user)
 */
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      meta: { message: "No token, not authorized" },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        meta: { message: "User not found, not authorized" },
      });
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        meta: { message: "Token expired, please log in again" },
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        meta: { message: "Invalid token, not authorized" },
      });
    }

    console.error("Authentication error:", error);
    return res.status(500).json({
      meta: { message: "Internal server error", error: error.message },
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      meta: { message: "Not authenticated" },
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      meta: { message: "Access forbidden: Admins only" },
    });
  }

  next();
};
