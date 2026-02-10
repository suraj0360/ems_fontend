import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        // If we store user info in local storage for persistence across refresh (non-sensitive)
        if (response.data.data.user) {
            localStorage.setItem('ems_current_user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.data.user) {
            localStorage.setItem('ems_current_user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            localStorage.removeItem('ems_current_user');
            // document.cookie = ... // Cookies are cleared by backend
        }
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('ems_current_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Optional: Fetch fresh profile from backend
    fetchProfile: async () => {
        const response = await api.get('/users/profile');
        localStorage.setItem('ems_current_user', JSON.stringify(response.data));
        return response.data;
    }
};
