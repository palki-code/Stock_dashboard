const Transaction = require('../models/Transaction');

// @desc    Create a buy request
// @route   POST /api/transactions/buy
// @access  Private
const buyStock = async (req, res) => {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
        return res.status(400).json({ message: 'Please provide symbol, quantity, and price' });
    }

    try {
        const transaction = await Transaction.create({
            user: req.user._id,
            symbol,
            type: 'buy',
            quantity,
            price,
            status: 'pending', // Requires admin approval
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error placing buy order' });
    }
};

// @desc    Create a sell request
// @route   POST /api/transactions/sell
// @access  Private
const sellStock = async (req, res) => {
    const { symbol, quantity, price } = req.body;

    if (!symbol || !quantity || !price) {
        return res.status(400).json({ message: 'Please provide symbol, quantity, and price' });
    }

    try {
        const transaction = await Transaction.create({
            user: req.user._id,
            symbol,
            type: 'sell',
            quantity,
            price,
            status: 'pending', // Requires admin approval
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error placing sell order' });
    }
};

// @desc    Get logged in user's transactions
// @route   GET /api/transactions/mytransactions
// @access  Private
const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching transactions' });
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching all transactions' });
    }
};

// @desc    Update transaction status (approve/reject)
// @route   PUT /api/transactions/:id/status
// @access  Private/Admin
const updateTransactionStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.status = status;
        const updatedTransaction = await transaction.save();

        res.json(updatedTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating transaction status' });
    }
};

module.exports = {
    buyStock,
    sellStock,
    getMyTransactions,
    getAllTransactions,
    updateTransactionStatus,
};
