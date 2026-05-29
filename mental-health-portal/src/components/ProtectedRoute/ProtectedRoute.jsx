import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, preserving the page they tried to visit
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based routing protections
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const path = location.pathname;

        // Prevent counselor from wandering into patient dashboard
        if (user.role === 'counselor' && path === '/dashboard') {
            return <Navigate to="/counselor-dashboard" replace />;
        }
        
        // Prevent patient from wandering into counselor dashboard
        if (user.role === 'user' && path === '/counselor-dashboard') {
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
