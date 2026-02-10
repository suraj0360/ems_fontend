import api from './api';

export const eventService = {
    getAllEvents: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/events?${params}`);
        return response.data; // Expecting { data: [], total: ... }
    },

    getEventById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    createEvent: async (eventData) => {
        // If image is a File object, we might need FormData
        // But for now assuming JSON with image URL string or handling upload separately
        const response = await api.post('/events', eventData);
        return response.data;
    },

    updateEvent: async (id, updates) => {
        const response = await api.patch(`/events/${id}`, updates);
        return response.data;
    },

    deleteEvent: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    getMyEvents: async () => {
        const response = await api.get('/events/my-events');
        return response.data;
    }
};
