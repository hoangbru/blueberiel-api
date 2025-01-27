import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
/**
 * Middleware to protect routes
 */
export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ meta: { message: "Not authorized" } });
    }
  }

  if (!token) {
    res.status(401).json({ meta: { message: "No token, not authorized" } });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    res
      .status(403)
      .json({ meta: { message: "Access forbidden: Admins only" } });
  }
};
