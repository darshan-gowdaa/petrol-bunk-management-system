// Error handler middleware
const humanizeErrorMessage = (err) => {
  if (err.message?.includes('ECONNREFUSED')) {
    return 'Database connection failed. Please try again in a moment.';
  }
  if (err.message?.includes('MongoServerError')) {
    return 'Database operation failed. Please contact admin if this persists.';
  }
  if (err.name === 'ValidationError') {
    return 'Invalid data provided. Please check your inputs and try again.';
  }
  if (err.name === 'JsonWebTokenError') {
    return 'Your session has expired. Please login again.';
  }
  if (err.message?.includes('jwt expired')) {
    return 'Your session has expired. Please login again.';
  }
  if (err.name === 'CastError') {
    return 'Invalid ID format. Please check the data and try again.';
  }
  if (err.code === 11000) {
    return 'This record already exists. Please use a different value.';
  }
  if (err.statusCode === 401) {
    return 'Invalid credentials. Please check your username and password.';
  }
  if (err.statusCode === 403) {
    return 'You do not have permission to perform this action.';
  }
  if (err.statusCode === 404) {
    return 'The requested resource was not found.';
  }
  return 'Something went wrong. Please try again, or contact admin if problem persists.';
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000) {
    statusCode = 400;
  }
  if (err.name === 'JsonWebTokenError' || err.message?.includes('jwt expired')) {
    statusCode = 401;
  }

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