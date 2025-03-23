// backend/controllers/expenseController.js
import Expense from "../models/Expense.js";
import { format } from "date-fns";

// Format expense data consistently
const formatExpense = (expense) => {
  const expenseData = expense._doc || expense;
  return {
    ...expenseData,
    date: format(
      new Date(expenseData.date || expenseData.createdAt),
      "yyyy-MM-dd"
    ),
  };
};

export const getExpenses = async (req, res) => {
  try {
    const { category, amountMin, amountMax, dateFrom, dateTo, description } =
      req.query;

    // Build filter object
    let filter = {};
    if (category) filter.category = category;
    if (description)
      filter.description = { $regex: description, $options: "i" };

    // Add amount range filter if provided
    if (amountMin || amountMax) {
      filter.amount = {};
      if (amountMin) filter.amount.$gte = parseFloat(amountMin);
      if (amountMax) filter.amount.$lte = parseFloat(amountMax);
    }

    // Add date range filter if provided
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const expenses = await Expense.find(filter);
    res.status(200).json(expenses.map((exp) => formatExpense(exp)));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(formatExpense(savedExpense));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(formatExpense(updatedExpense));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
