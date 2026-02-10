import api from './api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.patch('/users/profile', userData);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    toggleBlockUser: async (id, isBlocked) => {
        const response = await api.patch(`/users/${id}/block`, { isBlocked });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};
