const express = require('express');
const router = express.Router();

const { createShortUrl, getUrlDetails, getQR,  getUrls, getStats, deleteUrl } = require('../controller/urlController');

// url operations
router.post('/shorten', createShortUrl);
router.get('/', getUrls);
router.get('/:code', getUrlDetails);
router.delete('/:code', deleteUrl);

// analytics
router.get('/:code/stats', getStats);
router.get('/:code/qr', getQR);

module.exports = router;