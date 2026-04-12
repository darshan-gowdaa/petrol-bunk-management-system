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
    REQUIRED_FIELD: field => `Please enter ${field}`,
    INVALID_TYPE: (field, type) => `${field} must be a valid ${type}`,
    INVALID_DATE: field => `Please enter a valid date for ${field}`,
    INVALID_NUMBER: field => `${field} must be a positive number`,
    EMPTY_STRING: field => `${field} cannot be empty`,
    // Auth Errors
    UNAUTHORIZED: 'You do not have permission to access this. Please contact admin if you believe this is an error.',
    INVALID_CREDENTIALS: 'Invalid username or password. Please try again.',
    // Not Found Errors
    RESOURCE_NOT_FOUND: resource => `The ${resource} you are looking for could not be found.`,
    // Server Errors
    INTERNAL_SERVER_ERROR: 'Something went wrong on our end. Please try again, or contact admin if the problem persists.',
    DATABASE_ERROR: 'Database operation failed. Please try again or contact admin.',
    // Network Errors
    NETWORK_ERROR: 'We could not connect to the server. Please check your internet connection and try again.',
    TIMEOUT_ERROR: 'The request took too long. Please try again.'
};

// Validation schemas shared between frontend and backend
export const VALIDATION_SCHEMAS = {
    employee: { name: { type: 'string', required: true }, position: { type: 'string', required: true }, salary: { type: 'number', required: true, min: 0 } },
    expense: { category: { type: 'string', required: true }, amount: { type: 'number', required: true, min: 0 }, date: { type: 'date', required: true } },
    inventory: { name: { type: 'string', required: true }, currentStock: { type: 'number', required: true, min: 0 }, reorderLevel: { type: 'number', required: true, min: 0 } },
    sale: { product: { type: 'string', required: true }, quantity: { type: 'number', required: true, min: 0 }, price: { type: 'number', required: true, min: 0 } }
};