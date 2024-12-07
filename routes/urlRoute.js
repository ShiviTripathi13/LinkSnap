const express = require('express');
const router = express.Router();

// input sanitization middleware
const { validateAndSanitize } = require('../middleware/inputSanitaztion');
const { createShortUrl, getUrlDetails, getQR,  getUrls, getStats, deleteUrl, redirectUrl } = require('../controller/urlController');

// url operations
router.post('/shorten', validateAndSanitize, createShortUrl);
router.get('/', getUrls);
router.get('/:code', getUrlDetails);
router.delete('/:code', deleteUrl);

// analytics
router.get('/:code/stats', getStats);
router.get('/:code/qr', getQR);

module.exports = router;