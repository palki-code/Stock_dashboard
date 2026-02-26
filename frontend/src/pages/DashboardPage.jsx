import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
    const [symbol, setSymbol] = useState('');
    const [stock, setStock] = useState(null);
    const [watchlist, setWatchlist] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const { fetchWatchlist } = useContext(AuthContext);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const watchRes = await api.get('/watchlist');
            setWatchlist(watchRes.data);
            fetchWatchlist(); // update context count

            const transRes = await api.get('/transactions/mytransactions');
            setTransactions(transRes.data);
        } catch (error) {
            console.error('Error loading dashboard data', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.get(`/stocks/${symbol}`);
            setStock(data);
        } catch (error) {
            alert('Stock not found or API limit reached');
        }
    };

    const handleAddToWatchlist = async () => {
        if (!stock) return;
        try {
            await api.post('/watchlist', { symbol: stock.symbol });
            loadDashboardData();
            alert('Added to watchlist');
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding to watchlist');
        }
    };

    const handleTrade = async (type) => {
        if (!stock) return;
        const quantity = prompt(`Enter quantity to ${type}:`, "1");
        if (!quantity) return;

        try {
            await api.post(`/transactions/${type}`, {
                symbol: stock.symbol,
                quantity: Number(quantity),
                price: stock.price
            });
            alert(`${type} request submitted. Pending admin approval.`);
            loadDashboardData();
        } catch (error) {
            alert('Trade failed');
        }
    };

    return (
        <div className="container">
            <h1>User Dashboard</h1>

            <div className="card">
                <h2>Search Stock</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        placeholder="Enter Symbol (e.g. IBM, AAPL)"
                        required
                    />
                    <button type="submit" className="btn">Search</button>
                </form>

                {stock && (
                    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <h3>{stock.symbol}</h3>
                        <p>Price: ${stock.price}</p>
                        <p>High: ${stock.high} | Low: ${stock.low}</p>
                        <p>Change: {stock.changePercent}</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleAddToWatchlist} className="btn" style={{ backgroundColor: '#f1c40f', color: '#333' }}>⭐ Add to Watchlist</button>
                            <button onClick={() => handleTrade('buy')} className="btn" style={{ backgroundColor: '#2ecc71' }}>Buy</button>
                            <button onClick={() => handleTrade('sell')} className="btn" style={{ backgroundColor: '#e74c3c' }}>Sell</button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div className="card" style={{ flex: 1, minWidth: '300px' }}>
                    <h2>My Watchlist</h2>
                    {watchlist.length === 0 ? <p>No stocks in watchlist.</p> : (
                        <ul>
                            {watchlist.map(sym => (
                                <li key={sym} style={{ padding: '5px 0' }}>{sym}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="card" style={{ flex: 2, minWidth: '400px' }}>
                    <h2>Transaction History</h2>
                    {transactions.length === 0 ? <p>No transactions found.</p> : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Type</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(t => (
                                    <tr key={t._id}>
                                        <td>{t.symbol}</td>
                                        <td style={{ color: t.type === 'buy' ? '#2ecc71' : '#e74c3c', textTransform: 'capitalize' }}>{t.type}</td>
                                        <td>{t.quantity}</td>
                                        <td>${t.price}</td>
                                        <td style={{ fontWeight: 'bold' }}>{t.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
