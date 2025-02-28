import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import salesRoutes from "./routes/sales.js";
import employeeRoutes from "./routes/employees.js";
import inventoryRoutes from "./routes/inventoryroutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import reportsRoutes from "./routes/reports.js"; // Importing reports routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/sales", salesRoutes);


app.use("/api/employees", employeeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/reports", reportsRoutes); // Adding reports route

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/petrol-bunk")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
