import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
    (config) => {
        // We are using HttpOnly cookies for access token, so we might not need to attach it manually
        // BUT if we were using localStorage, we would do it here.
        // The backend `auth.middleware.js` checks headers OR cookies.
        // Let's support both for flexibility, but rely on cookies primarily.

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh endpoint
                // Note: /auth/refresh should rely on the httpOnly refreshToken cookie
                await api.post('/auth/refresh');

                // If successful, the new accessToken is set in cookies (or we get it in body if we changed design)
                // If we implemented access token in body for localstorage, we'd update it here.
                // Since our backend sets cookies, we just retry the request.
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout
                window.location.href = '/login'; // Or use a cleaner way to redirect
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Helper to simulate delay is no longer needed but kept for compatibility if any mock remains
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
