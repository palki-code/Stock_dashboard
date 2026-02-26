import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [watchlistCount, setWatchlistCount] = useState(0);

    useEffect(() => {
        if (token) {
            // Store token in localStorage
            localStorage.setItem('token', token);
            // Decode basic user info if needed, or simply rely on state populated via login/register

            // Optionally fetch watchlist count if user is logged in
            fetchWatchlist();
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setWatchlistCount(0);
        }
    }, [token]);

    const fetchWatchlist = async () => {
        if (!token) return;
        try {
            const res = await api.get('/watchlist');
            if (res.data) {
                setWatchlistCount(res.data.length);
            }
        } catch (error) {
            console.error('Failed to fetch watchlist', error);
        }
    };

    const login = (userData) => {
        setUser(userData);
        setToken(userData.token);
        if (userData.watchlist) {
            setWatchlistCount(userData.watchlist.length);
        } else {
            fetchWatchlist();
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setWatchlistCount(0);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, login, logout, watchlistCount, fetchWatchlist }}>
            {children}
        </AuthContext.Provider>
    );
};
