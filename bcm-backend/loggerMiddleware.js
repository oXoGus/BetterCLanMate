function loggerMiddleware(req, res, next) {
    // Log the timestamp, method, and URL for each request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Call next() to pass control to the next middleware function in the chain
  }
  
  module.exports = loggerMiddleware;
  