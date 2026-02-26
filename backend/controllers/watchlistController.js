const User = require('../models/User');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('watchlist');
        res.json(user.watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching watchlist' });
    }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
    const { symbol } = req.body;

    if (!symbol) {
        return res.status(400).json({ message: 'Please provide a stock symbol' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (user.watchlist.includes(symbol)) {
            return res.status(400).json({ message: 'Stock already in watchlist' });
        }

        user.watchlist.push(symbol);
        await user.save();

        res.json(user.watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding to watchlist' });
    }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:symbol
// @access  Private
const removeFromWatchlist = async (req, res) => {
    const { symbol } = req.params;

    try {
        const user = await User.findById(req.user._id);

        user.watchlist = user.watchlist.filter((s) => s !== symbol);
        await user.save();

        res.json(user.watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error removing from watchlist' });
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
};
