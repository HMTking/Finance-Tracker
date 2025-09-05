const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Sequelize/MySQL invalid ID format
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new Error(message);
    error.statusCode = 404;
  }

  // MySQL duplicate key constraint
  if (err.code === 11000 || err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    error = new Error(message);
    error.statusCode = 400;
  }

  // Sequelize validation error
  if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new Error(message);
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
