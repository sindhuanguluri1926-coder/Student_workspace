/**
 * Not Found handler for undefined routes
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Express error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Use existing status code if already set to an error status, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Format Mongoose validation errors
  let message = err.message;
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join('. ');
  } else if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
