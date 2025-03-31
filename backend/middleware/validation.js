// backend/middleware/validation.js - Request validation middleware
import { format } from "date-fns";

const validateNumber = (value, fieldName) => {
  if (value === undefined || value === null) throw new Error(`${fieldName} is required`);
  if (isNaN(value) || value < 0) throw new Error(`${fieldName} must be a positive number`);
};

const validateString = (value, fieldName) => {
  if (value === undefined || value === null) throw new Error(`${fieldName} is required`);
  if (!value.trim()) throw new Error(`${fieldName} cannot be empty`);
};

const validateDate = (date, fieldName = 'Date') => {
  if (date === undefined || date === null) throw new Error(`${fieldName} is required`);
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) throw new Error(`${fieldName} must be a valid date`);
};

const validateFields = (req, res, next, validations) => {
  try {
    validations.forEach(({ field, validator }) => validator(req.body[field], field));
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateEmployee = (req, res, next) =>
  validateFields(req, res, next, [
    { field: 'name', validator: validateString },
    { field: 'position', validator: validateString },
    { field: 'salary', validator: validateNumber }
  ]);

export const validateExpense = (req, res, next) =>
  validateFields(req, res, next, [
    { field: 'category', validator: validateString },
    { field: 'amount', validator: validateNumber },
    { field: 'date', validator: validateDate }
  ]);

export const validateInventory = (req, res, next) =>
  validateFields(req, res, next, [
    { field: 'name', validator: validateString },
    { field: 'currentStock', validator: validateNumber },
    { field: 'reorderLevel', validator: validateNumber }
  ]);

export const validateSale = (req, res, next) =>
  validateFields(req, res, next, [
    { field: 'product', validator: validateString },
    { field: 'quantity', validator: validateNumber },
    { field: 'price', validator: validateNumber }
  ]);
