// backend/middleware/validation.js - Request validation middleware
import { ERROR_MESSAGES, VALIDATION_SCHEMAS } from '../../frontend/src/constants/errorConstants.js';

const validate = {
  string: (value, fieldName) => 
    { if (!value?.trim()) throw new Error(ERROR_MESSAGES.EMPTY_STRING(fieldName)); },
  number: (value, fieldName) => 
    { if (value == null || isNaN(value) || value < 0) 
      throw new Error(ERROR_MESSAGES.INVALID_NUMBER(fieldName)); },
  date: (value, fieldName) => 
    { if (value == null || isNaN(new Date(value).getTime())) 
      throw new Error(ERROR_MESSAGES.INVALID_DATE(fieldName)); }
};

// Applies validation rules to request body fields
const validateFields = (req, res, next, schema) => {
  try {
    Object.entries(schema).forEach(([field, { type, required, min }]) => {
      const value = req.body[field];
      if (required && !value) throw new Error(ERROR_MESSAGES.REQUIRED_FIELD(field));
      if (value != null) {
        validate[type](value, field);
        if (min !== undefined && value < min) throw new Error(ERROR_MESSAGES.INVALID_NUMBER(field));
      }
    });
    next();
  } catch (error) {
    res.status(400).json({ type: 'VALIDATION_ERROR', message: error.message, field: error.field });
  }
};

export const validateEmployee = (req, res, next) => validateFields(req, res, next, VALIDATION_SCHEMAS.employee);
export const validateExpense = (req, res, next) => validateFields(req, res, next, VALIDATION_SCHEMAS.expense);
export const validateInventory = (req, res, next) => validateFields(req, res, next, VALIDATION_SCHEMAS.inventory);
export const validateSale = (req, res, next) => validateFields(req, res, next, VALIDATION_SCHEMAS.sale);