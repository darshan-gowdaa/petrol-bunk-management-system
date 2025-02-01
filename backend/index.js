import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import salesRoutes from './routes/sales.js';
import employeeRoutes from './routes/employees.js';
import inventoryRoutes from './routes/inventoryroutes.js';
import expenseRoutes from './routes/expenseroutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/expenses', expenseRoutes);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose
    .connect('mongodb://127.0.0.1:27017/petrol-bunk')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
