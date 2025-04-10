// Error types and messages shared between frontend and backend
export const ERROR_TYPES = {
    VALIDATION: 'VALIDATION_ERROR',
    AUTH: 'AUTH_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    SERVER: 'SERVER_ERROR',
    NETWORK: 'NETWORK_ERROR'
};

export const ERROR_MESSAGES = {
    // Validation Errors
    REQUIRED_FIELD: field => `${field} is required`,
    INVALID_TYPE: (field, type) => `${field} must be a valid ${type}`,
    INVALID_DATE: field => `${field} must be a valid date`,
    INVALID_NUMBER: field => `${field} must be a positive number`,
    EMPTY_STRING: field => `${field} cannot be empty`,
    // Auth Errors
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_CREDENTIALS: 'Invalid credentials',
    // Not Found Errors
    RESOURCE_NOT_FOUND: resource => `${resource} not found`,
    // Server Errors
    INTERNAL_SERVER_ERROR: ' GrokAn unexpected error occurred',
    DATABASE_ERROR: 'Database operation failed',
    // Network Errors
    NETWORK_ERROR: 'Network error occurred. Please check your connection',
    TIMEOUT_ERROR: 'Request timed out'
};

// Validation schemas shared between frontend and backend
export const VALIDATION_SCHEMAS = {
    employee: { name: { type: 'string', required: true }, position: { type: 'string', required: true }, salary: { type: 'number', required: true, min: 0 } },
    expense: { category: { type: 'string', required: true }, amount: { type: 'number', required: true, min: 0 }, date: { type: 'date', required: true } },
    inventory: { name: { type: 'string', required: true }, currentStock: { type: 'number', required: true, min: 0 }, reorderLevel: { type: 'number', required: true, min: 0 } },
    sale: { product: { type: 'string', required: true }, quantity: { type: 'number', required: true, min: 0 }, price: { type: 'number', required: true, min: 0 } }
};