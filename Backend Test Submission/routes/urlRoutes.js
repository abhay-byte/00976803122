const express = require('express');
const router = express.Router();
const { createShortUrl, getStats, redirectShortUrl } = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getStats);
router.get('/:shortcode', redirectShortUrl);

module.exports = router;
