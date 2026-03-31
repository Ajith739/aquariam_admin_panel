// src/services/authService.js
import API from '../api/axios';

// Dummy credentials constant
const DUMMY_EMAIL = "demo@example.com";
const DUMMY_PASSWORD = "demo1234";

const authService = {

    register: async (userData) => {
        try {
            const response = await API.post('/register', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    login: async (credentials) => {
        // Check for dummy credentials first
        if (credentials.email === DUMMY_EMAIL && credentials.password === DUMMY_PASSWORD) {
            const dummyResponse = {
                token: 'dummy-token-' + Date.now(),
                user: {
                    id: 1,
                    name: 'Demo User',
                    email: DUMMY_EMAIL,
                    phone: '0000000000',
                },
                message: 'Login successful (Demo Mode)',
            };
            localStorage.setItem('token', dummyResponse.token);
            localStorage.setItem('user', JSON.stringify(dummyResponse.user));
            return dummyResponse;
        }

        try {
            const response = await API.post('/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    logout: async () => {
        try {
            await API.post('/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    getProfile: async () => {
        try {
            const response = await API.get('/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch profile' };
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getStoredUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

export default authService;