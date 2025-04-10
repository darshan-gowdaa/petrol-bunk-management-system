// backend/middleware/validation.js - Request validation middleware
const validate = {
  string: (value, fieldName) => { 
    if (!value?.trim()) throw new Error(`${fieldName} is required and cannot be empty`); 
  },
  number: (value, fieldName) => { 
    if (value == null || isNaN(value) || value < 0) 
      throw new Error(`${fieldName} is required and must be a positive number`); 
  },
  date: (value, fieldName = 'Date') => { 
    if (value == null || isNaN(new Date(value).getTime())) 
      throw new Error(`${fieldName} is required and must be a valid date`); 
  }
};

// Applies validation rules to request body fields
const validateFields = (req, res, next, rules) => {
  try {
    Object.entries(rules).forEach(([field, type]) => validate[type](req.body[field], field));
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const validateEmployee = (req, res, next) => 
  validateFields(req, res, next, { name: 'string', position: 'string', salary: 'number' });

export const validateExpense = (req, res, next) => 
  validateFields(req, res, next, { category: 'string', amount: 'number', date: 'date' });

export const validateInventory = (req, res, next) => 
  validateFields(req, res, next, { name: 'string', currentStock: 'number', reorderLevel: 'number' });

export const validateSale = (req, res, next) => 
  validateFields(req, res, next, { product: 'string', quantity: 'number', price: 'number' });