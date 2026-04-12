// backend/middleware/errorHandler.js - Global error handling middleware
const humanizeErrorMessage = (err) => {
  // MongoDB connection errors
  if (err.message?.includes('ECONNREFUSED')) {
    return 'Database connection failed. Please try again in a moment.';
  }
  
  if (err.message?.includes('MongoServerError')) {
    return 'Database operation failed. Please contact admin if this persists.';
  }

  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    return 'Invalid data provided. Please check your inputs and try again.';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return 'Your session has expired. Please login again.';
  }

  if (err.message?.includes('jwt expired')) {
    return 'Your session has expired. Please login again.';
  }

  // Cast errors
  if (err.name === 'CastError') {
    return 'Invalid ID format. Please check the data and try again.';
  }

  // Duplicate key errors
  if (err.code === 11000) {
    return 'This record already exists. Please use a different value.';
  }

  // Authorization errors
  if (err.statusCode === 401) {
    return 'Invalid credentials. Please check your username and password.';
  }

  // Access denied
  if (err.statusCode === 403) {
    return 'You do not have permission to perform this action.';
  }

  // Not found
  if (err.statusCode === 404) {
    return 'The requested resource was not found.';
  }

  // Generic error
  return 'Something went wrong. Please try again, or contact admin if problem persists.';
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const humanizedMessage = humanizeErrorMessage(err);
  const developerMessage = process.env.NODE_ENV === 'development' ? err.message : undefined;

  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      name: err.name,
      message: err.message,
      statusCode,
      stack: err.stack
    });
  }

  res.status(statusCode).json({
    status: 'error',
    message: humanizedMessage,
    ...(process.env.NODE_ENV === 'development' && { developerMessage })
  });
};