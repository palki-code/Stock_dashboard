import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
    const { user, token, logout, watchlistCount } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            backgroundColor: 'var(--nav-bg)',
            color: 'var(--nav-text)',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>StockDashboard 💖</Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                    onClick={toggleTheme}
                    className="btn"
                    style={{ backgroundColor: 'transparent', border: '1px solid currentColor', color: 'inherit' }}
                >
                    {isDarkMode ? '🌞 Light' : '🌙 Dark'}
                </button>

                {token ? (
                    <>
                        <span>Welcome, {user?.name || 'User'}</span>
                        <Link to="/dashboard">Dashboard</Link>
                        {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                        {user?.role === 'user' && (
                            <span style={{ backgroundColor: '#e74c3c', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                Watchlist: {watchlistCount}
                            </span>
                        )}
                        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn">Login</Link>
                        <Link to="/signup" className="btn">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
