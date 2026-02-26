import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, token } = useContext(AuthContext);

    if (!token && !localStorage.getItem('token')) {
        return <Navigate to="/login" />;
    }

    // Since we might not have user immediately on refresh (if token is just in localstorage),
    // ideally we decode it or fetch profile. For simplicity in this capstone, if there's a token, we allow.
    // However, for adminOnly we MUST check the role.

    // In a real app we'd fetch the user profile on load. Assuming `user` object is stored in state on login/register.
    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
