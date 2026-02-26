const express = require('express');
const router = express.Router();
const { getStockDetails, getStockHistory } = require('../controllers/stockController');
const { protect } = require('../middleware/authMiddleware');

// All stock routes are protected (User must be logged in)
router.get('/:symbol', protect, getStockDetails);
router.get('/history/:symbol', protect, getStockHistory);

module.exports = router;
