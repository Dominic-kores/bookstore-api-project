// routes/books.js

const express = require('express');
const books = require('../data/books');
const validateBook = require('../middleware/validate');

// Create an express router
const router = express.Router();


// GET /api/books
// Return books with optional filtering, searching, sorting and pagination.
router.get('/', (req, res) => {
  const {
    category,
    inStock,
    search,
    sort,
    page,
    limit
  } = req.query;

  // Create a copy so we do not accidentally change the original array
  let results = [...books];

  // -----------------------------------------
  // FILTER BY CATEGORY
  // Example: ?category=fiction
  // -----------------------------------------
  if (category) {
    results = results.filter(
      (book) =>
        book.category.toLowerCase() === category.toLowerCase()
    );
  }

  // -----------------------------------------
  // FILTER BY STOCK AVAILABILITY
  // Example: ?inStock=true
  // -----------------------------------------
  if (inStock !== undefined) {
    const stockValue = inStock === 'true';

    results = results.filter(
      (book) => book.inStock === stockValue
    );
  }

  // -----------------------------------------
  // SEARCH TITLE OR AUTHOR
  // Example: ?search=ngugi
  // -----------------------------------------
  if (search) {
    const searchTerm = search.toLowerCase();

    results = results.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
  }

  // -----------------------------------------
  // SORT RESULTS
  // -----------------------------------------

  // Lowest price → highest price
  if (sort === 'price') {
    results.sort((a, b) => a.price - b.price);
  }

  // Highest price → lowest price
  if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  }

  // Alphabetical title
  if (sort === 'title') {
    results.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  // -----------------------------------------
  // BONUS: PAGINATION
  // -----------------------------------------
  if (page || limit) {
    const currentPage = Number.parseInt(page) || 1;
    const pageLimit = Number.parseInt(limit) || 10;

    // Prevent invalid pagination values
    if (currentPage < 1 || pageLimit < 1) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'page and limit must be positive numbers'
      });
    }

    const total = results.length;
    const totalPages = Math.ceil(total / pageLimit);

    // Calculate where the selected page starts
    const startIndex = (currentPage - 1) * pageLimit;

    // Get only the books belonging to the selected page
    const paginatedBooks = results.slice(
      startIndex,
      startIndex + pageLimit
    );

    return res.status(200).json({
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages,
      books: paginatedBooks
    });
  }

  // Standard response without pagination
  res.status(200).json({
    count: results.length,
    books: results
  });
});

// GET /api/books/stats
// Return bookstore statistics.
router.get('/stats', (req, res) => {
  const totalBooks = books.length;

  const inStockCount = books.filter(
    (book) => book.inStock
  ).length;

  const outOfStockCount = books.filter(
    (book) => !book.inStock
  ).length;

  // Total value of all books
  const totalValue = books.reduce(
    (total, book) => total + book.price,
    0
  );

  // Average price
  const averagePrice =
    totalBooks > 0 ? totalValue / totalBooks : 0;

  res.status(200).json({
    totalBooks,
    inStockCount,
    outOfStockCount,
    totalValue,
    averagePrice
  });
});


// GET /api/books/:id/related
// Return books belonging to the same category.
router.get('/:id/related', (req, res) => {
  const id = Number(req.params.id);

  // Validate ID
  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Book ID must be a number'
    });
  }

  // Find the selected book
  const book = books.find((book) => book.id === id);

  if (!book) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Book not found'
    });
  }

  // Find books from same category but exclude selected book
  const relatedBooks = books.filter(
    (item) =>
      item.category === book.category &&
      item.id !== book.id
  );

  res.status(200).json({
    count: relatedBooks.length,
    books: relatedBooks
  });
});

// GET /api/books/:id
// Return a single book.
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  // Book IDs must be numbers
  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Book ID must be a valid number'
    });
  }

  const book = books.find((book) => book.id === id);

  // Book does not exist
  if (!book) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Book with ID ${id} was not found`
    });
  }

  res.status(200).json(book);
});

// POST /api/books
// Create a new book.
router.post('/', validateBook, (req, res) => {
  const {
    title,
    author,
    isbn,
    price,
    category,
    inStock = true,
    coverImage = null
  } = req.body;

  // Check if another book already uses the ISBN
  const duplicateISBN = books.find(
    (book) => book.isbn === isbn
  );

  if (duplicateISBN) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A book with this ISBN already exists'
    });
  }

  // Generate next available ID
  const newId =
    books.length > 0
      ? Math.max(...books.map((book) => book.id)) + 1
      : 1;

  // Create new book object
  const newBook = {
    id: newId,
    title: title.trim(),
    author: author.trim(),
    isbn: isbn.trim(),
    price,
    category,
    inStock,
    coverImage,
    createdAt: new Date().toISOString()
  };

  // Add book to bookstore
  books.push(newBook);

  res.status(201).json(newBook);
});


// PUT /api/books/:id
// Replace all editable information for a book.
router.put('/:id', validateBook, (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Book ID must be a valid number'
    });
  }

  const bookIndex = books.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Book with ID ${id} was not found`
    });
  }

  const {
    title,
    author,
    isbn,
    price,
    category,
    inStock = true,
    coverImage = null
  } = req.body;

  // Prevent another book from using the same ISBN
  const duplicateISBN = books.find(
    (book) => book.isbn === isbn && book.id !== id
  );

  if (duplicateISBN) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Another book already uses this ISBN'
    });
  }

  const updatedBook = {
    id,
    title,
    author,
    isbn,
    price,
    category,
    inStock,
    coverImage,

    // Keep original creation date
    createdAt: books[bookIndex].createdAt
  };

  // Replace the existing book
  books[bookIndex] = updatedBook;

  res.status(200).json(updatedBook);
});



// PATCH /api/books/:id
// Update only the fields supplied by the client.
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Book ID must be a valid number'
    });
  }

  const bookIndex = books.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Book with ID ${id} was not found`
    });
  }

  const allowedFields = [
    'title',
    'author',
    'isbn',
    'price',
    'category',
    'inStock',
    'coverImage'
  ];

  // Reject fields that are not part of the book model
  const invalidFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid fields: ${invalidFields.join(', ')}`
    });
  }

  // Validate price when supplied
  if (
    req.body.price !== undefined &&
    (typeof req.body.price !== 'number' ||
      req.body.price <= 0)
  ) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'price must be a positive number'
    });
  }

  // Validate coverImage when supplied
  if (
    req.body.coverImage !== undefined &&
    req.body.coverImage !== null &&
    !/^https?:\/\//i.test(req.body.coverImage)
  ) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'coverImage must be a valid URL'
    });
  }

  // Prevent duplicate ISBN
  if (req.body.isbn) {
    const duplicateISBN = books.find(
      (book) =>
        book.isbn === req.body.isbn &&
        book.id !== id
    );

    if (duplicateISBN) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Another book already uses this ISBN'
      });
    }
  }

  // Merge old book data with supplied changes
  books[bookIndex] = {
    ...books[bookIndex],
    ...req.body
  };

  res.status(200).json(books[bookIndex]);
});



// DELETE /api/books/:id
// Remove a book from the inventory.
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid ID',
      message: 'Book ID must be a valid number'
    });
  }

  const bookIndex = books.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Book with ID ${id} was not found`
    });
  }

  // Remove one book from the array
  books.splice(bookIndex, 1);

  // 204 means success with no response body
  res.status(204).send();
});

module.exports = router;