const express = require('express');
const router = express.Router();
const {
    buyStock,
    sellStock,
    getMyTransactions,
    getAllTransactions,
    updateTransactionStatus
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// User routes
router.route('/buy').post(protect, buyStock);
router.route('/sell').post(protect, sellStock);
router.route('/mytransactions').get(protect, getMyTransactions);

// Admin routes
router.route('/').get(protect, admin, getAllTransactions);
router.route('/:id/status').put(protect, admin, updateTransactionStatus);

module.exports = router;
