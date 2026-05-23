export function errorHandler(error, _req, res, _next) {
  const status = error.statusCode || 500
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : error.message,
  })
}
