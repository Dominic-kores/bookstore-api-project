# bookstore-api-project


A backend REST API for managing a bookstore inventory using **Node.js** and **Express.js**.

This project demonstrates the key backend development concepts covered during Week 5, including REST API design, HTTP methods, middleware, request validation, error handling, filtering, searching, sorting, pagination, and proper HTTP status codes.

The bookstore contains a collection of books with prices in Kenyan Shillings (KES), and the API allows users to retrieve, create, update, and delete books.

---

## Project Objectives

The main objectives of this project are to:

- Build a RESTful backend API using Node.js and Express.js.
- Create organized API routes using `express.Router()`.
- Implement CRUD operations using appropriate HTTP methods.
- Use proper HTTP status codes for successful and unsuccessful requests.
- Implement middleware for:
  - JSON request parsing
  - CORS
  - HTTP request logging
  - Security headers
  - Validation
  - Error handling
- Validate data before adding or updating books.
- Prevent duplicate ISBN numbers.
- Implement filtering, searching, and sorting using query parameters.
- Add pagination support for large book collections.
- Provide bookstore inventory statistics.
- Handle undefined routes using a custom 404 middleware.
- Create consistent and readable error responses.
- Apply simple rate limiting to protect the API from excessive requests.
- Organize backend code into separate folders for routes, middleware, and data.
- Prepare the backend for connection to a frontend application.

---

## Technologies Used

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime for running the backend |
| Express.js | Framework used to build the REST API |
| CORS | Allows requests from frontend applications |
| Morgan | Logs HTTP requests in the terminal |
| Helmet | Adds security-related HTTP headers |
| Nodemon | Automatically restarts the development server |
| JavaScript | Main programming language |

---

## Project Structure

```text
bookstore-api/
│
├── data/
│   └── books.js
│
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── validate.js
│   └── rateLimiter.js
│
├── routes/
│   └── books.js
│
├── server.js
├── package.json
├── package-lock.json
|--Screenshots
├── .gitignore
└── README.md
