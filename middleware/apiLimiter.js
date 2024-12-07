const rateLimit = require('express-rate-limit');

// Defining the rate limit configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiting each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests. Please try again after some time.',
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

module.exports = apiLimiter;
