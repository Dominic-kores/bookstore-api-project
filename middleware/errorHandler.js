// Global error handling middleware
// Express recognizes it as error middleware because it has 4 parameters.
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // use the status code from the error if it exists, otherwise default to 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;