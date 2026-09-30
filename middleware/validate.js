// middleware/validate.js

// Categories accepted by the bookstore

const allowedCategories = [
    'fiction',
    'biography', 
    'business',
    'science', 
    'history', 
    'technology',
    'self-help', 
];

// Validate a book before POST or PUT requests
const validateBook = (req, res, next) => {
  const {
    title,
    author,
    isbn,
    price,
    category,
    inStock,
    coverImage
  } = req.body;

  // Store all validation problems here
  const errors = [];

  // Validate title
  if (typeof title !== 'string' || title.trim() === '') {
    errors.push('title is required');
  }

  // Validate author
  if (typeof author !== 'string' || author.trim() === '') {
    errors.push('author is required');
  }

  // Validate ISBN
  if (typeof isbn !== 'string' || isbn.trim() === '') {
    errors.push('isbn is required');
  }

  // Validate price
  if (typeof price !== 'number' || price <= 0) {
    errors.push('price must be a positive number');
  }

  // Validate category
  if (!allowedCategories.includes(category)) {
    errors.push(
      `category must be one of: ${allowedCategories.join(', ')}`
    );
  }

  // Validate inStock if provided
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    errors.push('inStock must be true or false');
  }

  // Bonus: validate cover image URL
  if (
    coverImage !== undefined &&
    coverImage !== null &&
    !/^https?:\/\//i.test(coverImage)
  ) {
    errors.push('coverImage must be a valid http:// or https:// URL');
  }

  // Stop the request if validation failed
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  // Validation passed
  next();
};

module.exports = validateBook;