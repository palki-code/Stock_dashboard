const axios = require('axios');

// @desc    Get stock overview and details
// @route   GET /api/stocks/:symbol
// @access  Private
const getStockDetails = async (req, res) => {
    const { symbol } = req.params;

    try {
        // We will use Alpha Vantage Global Quote endpoint for current details
        // Note: Free tier has API rate limits (5 per minute, 500 per day)
        const response = await axios.get(
            'https://api.twelvedata.com/quote',
            {
                params: {
                    symbol: symbol,
                    apikey: process.env.TWELVE_DATA_API_KEY
                }
            }
        );

        const data = response.data;

        if (!data || data.status === 'error') {
            return res.status(404).json({ message: data.message || 'Stock not found or API limit reached' });
        }

        const stockInfo = {
            symbol: data.symbol,
            price: parseFloat(data.close) || parseFloat(data.previous_close), // Twelvedata quote close price
            high: parseFloat(data.high),
            low: parseFloat(data.low),
            previousClose: parseFloat(data.previous_close),
            changePercent: data.percent_change + '%',
        };

        res.json(stockInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching stock data' });
    }
};

// @desc    Get historical stock data
// @route   GET /api/stocks/history/:symbol
// @access  Private
const getStockHistory = async (req, res) => {
    const { symbol } = req.params;

    try {
        // Using Alpha Vantage TIME_SERIES_DAILY
        const response = await axios.get(
            // `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            'https://api.twelvedata.com/time_series',
            {
                params: {
                    symbol: symbol,
                    interval: '1day',
                    apikey: process.env.TWELVE_DATA_API_KEY
                }
            }
        );

        const timeSeries = response.data.values;

        if (!timeSeries || response.data.status === 'error') {
            return res.status(404).json({ message: response.data.message || 'Historical data not found or API limit reached' });
        }

        // Get the last 30 days of data
        const history = timeSeries.slice(0, 30).map(item => ({
            date: item.datetime,
            price: parseFloat(item.close),
        }));

        res.json(history.reverse()); // Reverse to get oldest to newest for charts
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching historical data' });
    }
};

module.exports = {
    getStockDetails,
    getStockHistory,
};
