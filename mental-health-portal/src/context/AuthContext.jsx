/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Check local storage for initial state
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!sessionStorage.getItem('token');
    });
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = async (email, password, role = 'user') => {
        try {
            const response = await api.post('/auth/login', { email, password, role });

            if (response.data.token) {
                // Save token to sessionStorage (tab-specific)
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                setIsAuthenticated(true);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
        } catch (error) {
            console.error("Login error:", error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'user', title = '', specialty = '') => {
        try {
            await api.post('/auth/register', { name, email, password, role, title, specialty });
            // Automatically log in after successful registration
            return await login(email, password, role);
        } catch (error) {
            console.error("Registration error:", error.response?.data?.message || error.message);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Sync auth state across tabs
    React.useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                if (!localStorage.getItem('token')) {
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    setIsAuthenticated(true);
                    const storedUser = localStorage.getItem('user');
                    setUser(storedUser ? JSON.parse(storedUser) : null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const logout = () => {
        // Clear all session-related data from sessionStorage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Clear potential role-specific data or leftovers
        sessionStorage.removeItem('counselor_data');
        sessionStorage.removeItem('admin_data');
        
        // Update state immediately
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
