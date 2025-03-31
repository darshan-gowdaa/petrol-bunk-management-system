// backend/controllers/expenseController.js - Expense management controller
import Expense from "../models/Expense.js";
import { format } from "date-fns";

// Format expense data consistently
const formatExpense = (expense) => ({
  ...(expense._doc || expense),
  date: format(new Date(expense.date || expense.createdAt), "yyyy-MM-dd"),
});

const buildFilter = (query) => {
  const filter = {};
  const { category, amountMin, amountMax, dateFrom, dateTo, description } = query;

  if (category) filter.category = category;
  if (description) filter.description = { $regex: description, $options: "i" };
  if (amountMin || amountMax) {
    filter.amount = {};
    if (amountMin) filter.amount.$gte = parseFloat(amountMin);
    if (amountMax) filter.amount.$lte = parseFloat(amountMax);
  }
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom);
    if (dateTo) filter.date.$lte = new Date(dateTo);
  }
  return filter;
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find(buildFilter(req.query));
    res.status(200).json(expenses.map(formatExpense));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const expense = await new Expense(req.body).save();
    res.status(201).json(formatExpense(expense));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json(formatExpense(expense));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
