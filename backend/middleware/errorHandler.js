// backend/middleware/errorHandler.js - Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Something went wrong on the server';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: 'error',
    message
  });
};