import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api', // Using Vite proxy for backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT token to all requests
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling global errors like 401 Unauthorized
let isRedirecting = false;
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const url = error.config?.url || '';
            // Only redirect for non-login/non-register calls AND only if we have a token
            // (meaning the session expired, not that we're just logging in)
            const isAuthCall = url.includes('/login') || url.includes('/register');
            const hasToken = !!sessionStorage.getItem('token');

            if (!isAuthCall && hasToken && !isRedirecting) {
                isRedirecting = true;
                // Token has expired server-side — clear and redirect once
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                // Use a small delay so state clears before redirect
                setTimeout(() => {
                    isRedirecting = false;
                    window.location.href = '/login';
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

// Authentication APIs
export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);

// Mood APIs
export const saveMood = (data) => api.post('/mood', data);
export const getMoodHistory = () => api.get('/moods');

// AI Chat APIs
export const chatWithAI = (data) => api.post('/chat', data);

// Resource APIs
export const getResources = () => api.get('/resources');
export const getCounselors = () => api.get('/counselors');

export default api;
