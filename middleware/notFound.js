// middleware/notFound.js

// Handle 404 - Not Found

const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
}

module.exports = notFound;  