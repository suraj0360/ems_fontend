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
        // Axios handles FormData (multipart/form-data) automatically
        // as well as standard JSON objects.
        const response = await api.post('/events', eventData);
        return response.data;
    },

    updateEvent: async (id, eventData) => {
        const response = await api.patch(`/events/${id}`, eventData);
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
