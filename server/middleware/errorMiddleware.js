// 404 handler — placed after all routes.
export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found — ${req.originalUrl}`))
}

// Centralized error handler — catches thrown errors and asyncHandler rejections.
export function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500)
  let message = err.message || 'Server Error'

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue || {})[0]
    message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already in use`
  }

  // Multer upload errors (file too large, wrong field name, etc.)
  if (err.name === 'MulterError') {
    statusCode = 400
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image is too large — max size is 5MB'
    } else {
      message = err.message
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
