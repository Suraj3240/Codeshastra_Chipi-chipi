// Middleware function to handle errors and send appropriate responses
const errorMiddleware = (err, req, res, next) => {
  // Default error object with status code, success status, and error message
  const defaultError = {
    statusCode: 404, // Default status code
    success: "failed", // Default status
    message: err, // Default error message
  };

  // Handle validation errors
  if (err?.name === "ValidationError") {
    defaultError.statusCode = 404; // Set status code for validation error
    // Construct error message by joining all validation error messages
    defaultError.message = Object.values(err.errors)
      .map((el) => el.message)
      .join(",");
  }

  // Handle duplicate key error (unique constraint violation)
  if (err.code && err.code === 11000) {
    defaultError.statusCode = 404; // Set status code for duplicate key error
    // Construct error message indicating which field has to be unique
    defaultError.message = `${Object.values(err.keyValue)} field has to be unique!`;
  }

  // Send response with appropriate status code and error message
  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;
