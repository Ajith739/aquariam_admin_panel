// src/services/authService.js
// This file contains all authentication-related API calls
// It's like a "helper" that simplifies API calls for auth

// Import our pre-configured axios instance
import API from '../api/axios';

// Create an object with all auth methods
const authService = {
    
    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    | Sends registration data to Laravel API
    | 
    | Parameters:
    |   userData = { name: "John", email: "john@test.com", 
    |                password: "12345678", password_confirmation: "12345678" }
    |
    | Returns: Promise with server response
    */
    register: async (userData) => {
        try {
            // API.post('/register', userData) sends:
            // POST http://localhost:8000/api/register
            // Body: { name, email, password, password_confirmation }
            const response = await API.post('/register', userData);
            
            // If registration is successful, save token and user data
            if (response.data.token) {
                // Save token to localStorage for future API calls
                localStorage.setItem('token', response.data.token);
                // Save user data as JSON string
                // JSON.stringify converts object to string for storage
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            // Return the response data to the calling component
            return response.data;
            
        } catch (error) {
            // If the server returned an error response
            // error.response.data contains the error details from Laravel
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    | Sends login credentials to Laravel API
    | 
    | Parameters:
    |   credentials = { email: "john@test.com", password: "12345678" }
    |
    | Returns: Promise with server response
    */
    login: async (credentials) => {
        try {
            // Send POST request to /api/login
            const response = await API.post('/login', credentials);
            
            // If login successful, save the token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
            
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    | Sends logout request to Laravel API and clears local storage
    */
    logout: async () => {
        try {
            // Send POST request to /api/logout
            // The interceptor will automatically add the Bearer token
            await API.post('/logout');
        } catch (error) {
            // Even if the API call fails, we still want to clear local data
            console.error('Logout API error:', error);
        } finally {
            // 'finally' ALWAYS runs, whether try succeeded or failed
            // Remove token and user data from browser storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    /*
    |--------------------------------------------------------------------------
    | GET PROFILE
    |--------------------------------------------------------------------------
    | Fetches the logged-in user's profile from the API
    */
    getProfile: async () => {
        try {
            // Send GET request to /api/profile
            // Token is automatically added by the interceptor
            const response = await API.get('/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch profile' };
        }
    },

    /*
    |--------------------------------------------------------------------------
    | CHECK IF USER IS LOGGED IN
    |--------------------------------------------------------------------------
    | Checks if a token exists in localStorage
    | Returns true/false
    */
    isAuthenticated: () => {
        // If token exists in localStorage, user is "logged in"
        return !!localStorage.getItem('token');
        // !! converts any value to boolean
        // null → false, "some_token_string" → true
    },

    /*
    |--------------------------------------------------------------------------
    | GET STORED USER
    |--------------------------------------------------------------------------
    | Gets user data from localStorage (without making API call)
    */
    getStoredUser: () => {
        const user = localStorage.getItem('user');
        // JSON.parse converts the string back to an object
        return user ? JSON.parse(user) : null;
    },
};

// Export for use in other files
export default authService;