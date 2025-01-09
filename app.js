import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import {
  categoryRoutes,
  productRoutes,
  uploadRoutes,
  userRoutes,
} from "./routes/index.js";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3001; // Set default port if not defined

// Middleware
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const routes = [categoryRoutes, productRoutes, uploadRoutes, userRoutes];

routes.forEach((router) => app.use("/api", router));

// MongoDB Configuration
mongoose.set("strictQuery", true);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
