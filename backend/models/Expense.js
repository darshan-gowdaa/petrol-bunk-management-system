// backend/models/Expense.js - Expense data model
import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
