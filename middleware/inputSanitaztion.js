const { body, validationResult } = require('express-validator');

// Middleware for sanitization and validation
const validateAndSanitize = [
  body('longUrl')
    .isURL()
    .withMessage('Invalid URL format.')
    .trim()
    .escape(), // Remove dangerous characters
  body('customAlias')
    .optional()
    .isAlphanumeric()
    .withMessage('Custom alias must contain only alphanumeric characters.')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {validateAndSanitize};
