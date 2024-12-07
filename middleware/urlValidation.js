const Joi = require('joi');

// Defining the validation schema for the incoming data
const urlValidationSchema = Joi.object({
    longUrl: Joi.string()
        .uri({ scheme: ['http', 'https'] }) // Ensures it's a valid URL
        .required() // longUrl is required
        .messages({
            'string.uri': 'longUrl must be a valid URL',
            'string.empty': 'longUrl cannot be empty',
            'any.required': 'longUrl is required',
        }),
    customAlias: Joi.string()
        .alphanum() // Ensures the alias only contains alphanumeric characters
        .min(3)
        .max(15)
        .optional() // customAlias is optional
        .messages({
            'string.alphanum': 'customAlias must be alphanumeric',
            'string.min': 'customAlias must be at least 3 characters long',
            'string.max': 'customAlias must not be longer than 15 characters',
        }),
});

module.exports = { urlValidationSchema };
