// backend/index.js - Main server entry point
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import salesRoutes from "./routes/sales.js";
import employeeRoutes from "./routes/employees.js";
import inventoryRoutes from "./routes/inventoryroutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import reportsRoutes from "./routes/reports.js";
import authRoutes from "./routes/auth.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportsRoutes);

// Global error handling middleware
app.use(errorHandler);

// MongoDB Connection - Using environment variable with fallback
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petrol-bunk";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Only start server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
  process.exit(1);
});
