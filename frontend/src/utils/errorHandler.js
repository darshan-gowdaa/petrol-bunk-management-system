import { ERROR_TYPES, ERROR_MESSAGES } from '../constants/errorConstants';
import { showToast } from './toastConfig';

// Handles API errors and shows appropriate toast messages
export const handleApiError = (error) => {
    const errorData = error.response?.data;
    if (!errorData) return showToast.error(ERROR_MESSAGES.NETWORK_ERROR);

    const msg = errorData.message;
    switch (errorData.type) {
        case ERROR_TYPES.VALIDATION: showToast.error(msg); break;
        case ERROR_TYPES.AUTH: showToast.error(msg || ERROR_MESSAGES.UNAUTHORIZED); break;
        case ERROR_TYPES.NOT_FOUND: showToast.error(msg || ERROR_MESSAGES.RESOURCE_NOT_FOUND('Resource')); break;
        case ERROR_TYPES.SERVER: showToast.error(msg || ERROR_MESSAGES.INTERNAL_SERVER_ERROR); break;
        default: showToast.error(msg || ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
};

// Validates form data against a schema, returning errors if any
export const validateFormData = (data, schema) => {
    const errors = {};
    Object.entries(schema).forEach(([field, { type, required }]) => {
        const value = data[field];
        if (required && !value) errors[field] = ERROR_MESSAGES.REQUIRED_FIELD(field);
        else if (value != null) {
            if (type === 'number' && (isNaN(value) || value < 0)) errors[field] = ERROR_MESSAGES.INVALID_NUMBER(field);
            if (type === 'date' && isNaN(new Date(value).getTime())) errors[field] = ERROR_MESSAGES.INVALID_DATE(field);
            if (type === 'string' && !value.trim()) errors[field] = ERROR_MESSAGES.EMPTY_STRING(field);
        }
    });
    return Object.keys(errors).length ? errors : null;
};