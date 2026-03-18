// src/api/axios.js
// This file creates a pre-configured Axios instance
// Instead of writing the base URL every time, we configure it once here

// Import axios library
import axios from 'axios';

// Create a custom axios instance with default settings
const API = axios.create({
    
  // baseURL: the starting URL for all requests
  // Instead of typing "http://localhost:8000/api" every time,
  // we just type "/login" and axios adds the base URL automatically
  // import.meta.env.VITE_API_URL reads from our .env file
  baseURL: import.meta.env.VITE_API_URL,
  // So API.post('/login') actually goes to:
  // http://localhost:8000/api/login
    
    // headers: Default headers sent with every request
    headers: {
        // Tell the server we're sending JSON data
        'Content-Type': 'application/json',
        // Tell the server we want JSON response back
        'Accept': 'application/json',
    },
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| An interceptor runs BEFORE every request is sent
| We use it to automatically add the auth token to every request
| 
| Flow:
| 1. You call API.get('/profile')
| 2. INTERCEPTOR runs first → adds Authorization header with token
| 3. Request is sent to server WITH the token
*/
API.interceptors.request.use(
    (config) => {
        // Try to get the token from localStorage
        // localStorage is browser storage that persists even after closing the tab
        const token = localStorage.getItem('token');
        
        // If a token exists, add it to the request headers
        if (token) {
            // 'Bearer' is the authentication scheme
            // Format: "Bearer eyJ0eXAiOiJKV1QiLCJ..."
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Return the modified config (MUST return this)
        return config;
    },
    (error) => {
        // If something goes wrong with the interceptor, reject the promise
        return Promise.reject(error);
    }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
| An interceptor that runs AFTER every response is received
| We use it to handle common errors globally
| 
| For example: if token expired, redirect to login
*/
API.interceptors.response.use(
    (response) => {
        // If response is successful (status 200-299), just return it
        return response;
    },
    (error) => {
        // If server returns 401 (Unauthorized)
        // This usually means the token is invalid or expired
        if (error.response && error.response.status === 401) {
            // Remove the invalid token from storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirect to login page
            window.location.href = '/login';
        }
        // Pass the error to the calling code
        return Promise.reject(error);
    }
);

// Export the configured API instance
// Other files will import this to make API calls
export default API;