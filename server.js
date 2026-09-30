// server.js

// Import Express and required middleware packages
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Import application routes
const bookRoutes = require('./routes/books');

// Import custom middleware
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Create Express application
const app = express();


// Server port
const PORT = process.env.PORT || 5001;

// -----------------------------------------
// GLOBAL MIDDLEWARE
// -----------------------------------------

// Add security-related HTTP headers
app.use(helmet());

// Allow frontend applications to access the API
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Log incoming HTTP requests
app.use(morgan('dev'));

// Bonus: restrict excessive requests
app.use(rateLimiter);

// -----------------------------------------
// HOME ROUTE
// -----------------------------------------

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bookstore REST API is running'
  });
});

// -----------------------------------------
// BOOK ROUTES
// -----------------------------------------

// All routes inside routes/books.js start with /api/books
app.use('/api/books', bookRoutes);

// -----------------------------------------
// ERROR HANDLING
// -----------------------------------------

// Handles routes that do not exist
app.use(notFound);

// Must come last
app.use(errorHandler);

// -----------------------------------------
// START SERVER
// -----------------------------------------

app.listen(PORT, () => {
  console.log(
    `Bookstore API running at http://localhost:${PORT}`
  );
});